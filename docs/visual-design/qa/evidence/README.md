# Order 11 Evidence

> Evidence availability (8 November 2026): some historical captures referenced below are absent from this checkout. Their filenames are retained as archive references, not current verification evidence. Rerun the documented checks for fresh evidence.

**Final Chromium run:** 12 September 2026  
**Environment:** Chromium 152.0.7977.64, headless Linux, DevTools Protocol  
**Publication status:** Not approved

## Machine-readable result

[`order-11-audit-results.json`](order-11-audit-results.json) records 17 of 17 passing Order 11 assertions across the 12 page studies, three state boards, and journey map. The file includes every per-artifact semantic, contrast, accessibility-tree, keyboard, bilingual, forced-color, reflow, state, and no-JavaScript result plus the motion, touch, performance, and budget details.

## Representative captures

| Capture | Evidence |
| --- | --- |
| `emergency-320-en-forced-colors-reduced.png` (unavailable archive: `emergency-320-en-forced-colors-reduced.png`) | Emergency at 320 CSS px with Chromium forced colors and reduced motion. |
| `appointment-failure-360-en-reduced.png` (unavailable archive: `appointment-failure-360-en-reduced.png`) | Known recoverable appointment failure with retained editing and explicit non-operational identity. |
| `doctor-directory-loading-360-am-reduced.png` (unavailable archive: `doctor-directory-loading-360-am-reduced.png`) | Controlled loading state in the visibly disclaimed Amharic geometry fixture. |

The captures were visually inspected after the final corrections. No generated Firefox capture is listed because the installed headless Firefox renderer failed before producing an image; that limitation is recorded in the QA report.

## Reproduce

Start a local debugging browser and an optional localhost server:

```sh
chromium --headless --no-sandbox --disable-gpu \
  --remote-debugging-port=9444 \
  --user-data-dir=/tmp/hallelujah-order11-chromium \
  about:blank

python3 -m http.server 8666 --bind 127.0.0.1 \
  --directory hallelujah/docs

ORDER11_DEBUG_PORT=9444 \
ORDER11_HTTP_BASE=http://127.0.0.1:8666 \
node hallelujah/docs/visual-design/qa/audit-order-11.mjs
```

`ORDER11_HTTP_BASE` is optional. Without it, the runner still performs the full functional matrix, but file URLs cannot demonstrate actual network throttling.

## Evidence limits

See the [full QA record](../order-11-design-motion-qa.md#6-cross-browser-and-humandevice-limitations). Automated local evidence does not replace professional language review, real assistive-technology or device testing, manual browser zoom, cross-browser parity, production performance/security testing, human comprehension, hospital approval, or publication authorization.

