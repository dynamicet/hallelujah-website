# B04-012 controlled validation evidence — 5 October 2026

Target: fictional English loopback/noindex fixtures on branch
`b04-012-service-directory-validation`, directed by workspace identity `befikadusata`.

Prerequisite B04-011 merged as `c34d1aa773bb5d3a0d014402c02a68fb49434cd0`;
[exact-main run 37317948582](https://github.com/dynamicet/hallelujah-website/actions/runs/37317948582)
passed.

## Observed results

- `service-directory:validate`: 20 cases pass. Fictional patient navigation uses name/synonym
  vocabulary, rejects unsupported spelling without inferred recommendations, preserves canonical
  IDs across pagination and resolution, bounds copied URLs, removes records at lifecycle deadlines,
  excludes unpublished/withdrawn records, rejects duplicate sets and withholds claims/actions.
- `service-directory:smoke`: 175 cases pass. Existing responsive/capability/safety checks plus
  native Back/Forward and a no-JavaScript synonym result in the accessibility tree are covered.
- Live dependency audit: 644 dependencies, zero moderate/high/critical findings.
- Reachable-history secret scan: passes.
- `git diff --check`: passes.

The first browser assertion expected a textbox role for an HTML search input. Chromium exposes
`searchbox`; correcting the test expectation made the named-field assertion pass. No product
change was necessary.

Full `pnpm verify` and independent frozen clean reconstruction pass with the pinned Python environment.
The clean lockfile graph SHA-256 is `8056d55de822a1e38f68ac909a2c199f798cd86b849f29151a5e3c2949ed33c8`;
workspace importer graph SHA-256 is `2fb83f002b80a6efbc16ef014310132a2aeef1342849797942a0d583d7e315b0`. Sandbox loopback/package-store
restrictions require elevated execution. Asset-format tests require the existing pinned Python
worker environment at `/tmp/b04-011-asset-python/bin/python`, supplied via ASSET_FORMAT_PYTHON.
No missing prerequisite is treated as a passing result.

## Limits

These deterministic synthetic tasks do not establish real patient taxonomy comprehension,
approved spelling/synonyms, clinical wording, translation or human assistive-technology acceptance.
DEL-01 and all authentic-data, production and publication gates remain open. No public service
route or active appointment action is introduced. B04-012 is In review after passing local T0; hosted exact-head T1 and explicit controlled acceptance
remain pending; B04-013 is not promoted.
