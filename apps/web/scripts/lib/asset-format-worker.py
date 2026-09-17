"""Bounded private format worker. Never opens a URL or imports authored code."""
import json
import math
import re
import struct
import sys
import unicodedata
import xml.etree.ElementTree as ET
from pathlib import Path


def baseline(locale):
    if locale == "en":
        return set(range(32, 127))
    return {cp for cp in range(0x1200, 0x1380) if unicodedata.category(chr(cp)) != "Cn"}


def font_process(source, directory, governance):
    import fontTools
    import brotli
    from fontTools import subset
    from fontTools.ttLib import TTFont
    if fontTools.version != "4.65.0" or brotli.__version__ != "1.2.0":
        raise ValueError("Font processor versions do not match policy")
    header = source.read_bytes()[:48]
    if len(header) != 48 or struct.unpack_from(">I", header, 16)[0] > 16 * 1024 * 1024:
        raise ValueError("Font expansion limit exceeded")
    font = TTFont(source, lazy=False, checkChecksums=2, recalcTimestamp=False)
    allowed = {"GlyphOrder", "head", "hhea", "maxp", "OS/2", "hmtx", "cmap", "loca", "glyf", "name", "post", "GDEF", "GPOS", "GSUB", "kern", "gasp", "DSIG", "fpgm", "prep", "cvt ", "STAT"}
    if font.flavor != "woff2" or "glyf" not in font or set(font.keys()) - allowed:
        raise ValueError("Only bounded static TrueType WOFF2 fonts are supported")
    for tag in font.keys():
        font[tag]  # Fully decompile before accepting or subsetting.
    if not 1 <= font["maxp"].numGlyphs <= 10000 or font["OS/2"].usWeightClass not in [400, 600, 700]:
        raise ValueError("Font glyph count or weight violates policy")
    if font["OS/2"].fsType & 0x0302:
        raise ValueError("Font embedding/subsetting restrictions prohibit this output")
    cmap = font.getBestCmap() or {}
    result = []
    for locale, alternative in governance["localized"].items():
        required = baseline(locale)
        required.update(ord(c) for key, value in alternative.items() if key != "purpose" and isinstance(value, str) for c in value if not c.isspace())
        if not required.issubset(cmap) or any(cmap[cp] == ".notdef" for cp in required):
            raise ValueError("Font is missing required language coverage")
        selected = TTFont(source, lazy=False, recalcTimestamp=False)
        options = subset.Options()
        options.hinting = False
        options.recalc_timestamp = False
        options.name_IDs = []
        options.drop_tables += ["DSIG", "STAT"]
        options.layout_features = ["*"]
        engine = subset.Subsetter(options=options)
        engine.populate(unicodes=sorted(required))
        engine.subset(selected)
        selected["name"].names = []
        for name_id, value in [(1, governance["assetId"]), (2, "Regular"), (4, governance["assetId"]), (6, governance["assetId"]), (13, governance["rights"]["license"])]:
            selected["name"].setName(value, name_id, 3, 1, 0x409)
        selected["head"].created = selected["head"].modified = 2082844800
        selected.flavor = "woff2"
        filename = "font-" + locale + ".woff2"
        selected.save(directory / filename)
        decoded = TTFont(directory / filename, lazy=False)
        if not required.issubset(decoded.getBestCmap() or {}):
            raise ValueError("Subset lost required language coverage")
        result.append({"name": filename, "mime": "font/woff2", "purpose": "font", "locale": locale, "coverage": sorted(required), "weight": selected["OS/2"].usWeightClass})
    return result


def svg_process(source, directory):
    raw = source.read_bytes().decode("utf-8", errors="strict")
    if len(raw) > 256 * 1024 or "<!" in raw or "<?" in raw or "&" in raw:
        raise ValueError("SVG entities/declarations are prohibited")
    root = ET.fromstring(raw)
    namespace = "{http://www.w3.org/2000/svg}"
    def tag(node):
        return node.tag.removeprefix(namespace)
    if tag(root) != "svg":
        raise ValueError("SVG root is invalid")
    width, height = (int(root.attrib.get(k, "0")) for k in ["width", "height"])
    if not 1 <= width <= 1280 or not 1 <= height <= 1280:
        raise ValueError("SVG intrinsic dimensions exceed policy")
    if root.attrib.get("viewBox") != f"0 0 {width} {height}":
        raise ValueError("SVG viewBox must preserve its intrinsic geometry")
    common = {"fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin", "opacity", "fill-rule", "transform"}
    geometry = {"svg": {"width", "height", "viewBox"}, "g": set(), "path": {"d"}, "rect": {"x", "y", "width", "height", "rx", "ry"}, "circle": {"cx", "cy", "r"}, "ellipse": {"cx", "cy", "rx", "ry"}, "line": {"x1", "y1", "x2", "y2"}, "polyline": {"points"}, "polygon": {"points"}}
    count = 0
    def clean(node, depth=0):
        nonlocal count
        count += 1
        name = tag(node)
        if depth > 16 or count > 1000 or name not in geometry or (node.text or "").strip() or (node.tail or "").strip():
            raise ValueError("SVG contains unsupported content")
        output = ET.Element(name)
        for key, value in node.attrib.items():
            if key not in common | geometry[name] or len(value) > 16384:
                raise ValueError("SVG attribute is prohibited")
            if key in ["fill", "stroke"]:
                valid = re.fullmatch(r"(?:none|#[0-9a-fA-F]{3}|#[0-9a-fA-F]{6})", value)
            elif key in ["stroke-linecap", "stroke-linejoin", "fill-rule"]:
                valid = value in ["butt", "round", "square", "miter", "bevel", "nonzero", "evenodd"]
            elif key == "transform":
                valid = re.fullmatch(r"(?:(?:matrix|translate|scale|rotate|skewX|skewY)\([0-9eE.,+\-\s]+\)\s*)+", value)
            elif key == "d":
                valid = re.fullmatch(r"[MmLlHhVvCcSsQqTtAaZz0-9eE.,+\-\s]+", value)
            else:
                valid = re.fullmatch(r"[0-9eE.,+\-\s]+", value)
            if not valid:
                raise ValueError("SVG contains unsafe attribute data")
            numbers = re.findall(r"[+\-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+\-]?\d+)?", value) if key not in ["fill", "stroke"] else []
            if any(not math.isfinite(float(n)) or abs(float(n)) > 1000000 for n in numbers):
                raise ValueError("SVG numeric limits exceeded")
            output.set(key, value)
        for child in node:
            if tag(child) == "metadata":
                continue
            output.append(clean(child, depth + 1))
        return output
    sanitized = clean(root)
    sanitized.set("xmlns", "http://www.w3.org/2000/svg")
    (directory / "vector.svg").write_bytes(ET.tostring(sanitized, encoding="utf-8"))
    return [{"name": "vector.svg", "mime": "image/svg+xml", "purpose": "vector", "width": width, "height": height}]


def fixture_font(directory, latin_only=False):
    from fontTools.fontBuilder import FontBuilder
    from fontTools.pens.ttGlyphPen import TTGlyphPen
    cps = baseline("en") | (set() if latin_only else baseline("am"))
    builder = FontBuilder(1000, isTTF=True)
    names = [".notdef"] + ["u%04X" % cp for cp in sorted(cps)]
    builder.setupGlyphOrder(names)
    builder.setupCharacterMap({cp: "u%04X" % cp for cp in cps})
    glyphs = {}
    for name in names:
        pen = TTGlyphPen(None)
        if name != "u0020":
            pen.moveTo((100, 0)); pen.lineTo((500, 0)); pen.lineTo((500, 700)); pen.lineTo((100, 700)); pen.closePath()
        glyphs[name] = pen.glyph()
    builder.setupGlyf(glyphs)
    builder.setupHorizontalMetrics({name: (600, 0) for name in names})
    builder.setupHorizontalHeader(ascent=800, descent=-200)
    builder.setupNameTable({"familyName": "Synthetic geometry fixture", "styleName": "Regular", "uniqueFontIdentifier": "Synthetic-only", "fullName": "Synthetic private fixture", "psName": "SyntheticFixture"})
    builder.setupOS2(sTypoAscender=800, sTypoDescender=-200, usWinAscent=800, usWinDescent=200, usWeightClass=400)
    builder.setupPost()
    builder.font.flavor = "woff2"
    builder.save(directory / "fixture.woff2")
    return []


if __name__ == "__main__":
    mode, source_arg, directory_arg = sys.argv[1:4]
    source, directory = Path(source_arg), Path(directory_arg)
    if mode == "font":
        result = font_process(source, directory, json.loads(sys.argv[4]))
    elif mode == "svg":
        result = svg_process(source, directory)
    elif mode in ["fixture-font", "fixture-latin"]:
        result = fixture_font(directory, mode == "fixture-latin")
    else:
        raise ValueError("Unsupported private worker mode")
    print(json.dumps(result))
