# `B01-013` controlled-development evidence

**Build/environment:** Branch `b01-013-component-review-harness`, local `T0`, 16 September 2026, Africa/Addis_Ababa
**Method/tester:** Codex under client-directed temporary Designer/Frontend/QA roles; pinned Node.js 24.21.0 and pnpm 10.27.0
**Status:** Done for controlled development; local `T0`, hosted implementation `T1`, and client acceptance recorded on 16 September 2026, Africa/Addis_Ababa. Final acceptance-documentation CI must pass before merge. [Issue `#26`](https://github.com/dynamicet/hallelujah-website/issues/26) and [PR `#27`](https://github.com/dynamicet/hallelujah-website/pull/27) track closeout.

| Expected | Actual | Result |
| --- | --- | --- |
| All rendering components inventoried; review controls excluded from application | Contract check inventories 41 rendering components and checks source/public exclusion | Pass |
| Loopback-only routes, bounded state, no POST collection | Synthetic upstream receives no request for all denied route/method/query cases | Pass |
| Literal form values and first-party enhancement preserved | Amharic stress leaves textarea content literal; Next scripts/flight removed from review copy | Pass |
| Bilingual responsive/capability matrix | Final shared suite, 90 language/capability/viewport cases and bilingual keyboard/media/history retests pass | Pass |
| Full component interaction and actual media/history checks | Final shared suite, 90 language/capability/viewport cases and bilingual keyboard/media/history retests pass | Pass |
| Repository checks, secret scan, dependency audit, captures | Full verification, history scan, dependency audit and 47 sanitized artifacts pass | Pass |

Only synthetic text and abstract first-party media are reviewed. English source wording accompanies
explicitly unreviewed Amharic shaping; this is not language acceptance. Physical devices, human AT,
actual browser zoom, authentic image/font loss, and production performance remain higher-tier needs.
No personal data, real hospital fact, provider request, or restricted artifact is authorized.

**Review/expiry:** This local evidence is invalidated by relevant code/configuration/content/asset,
browser/AT or acceptance-matrix changes; sanitized repository retention follows the working
`B00-015` / `DEL-01` baseline. Defects and passing retests are recorded below.

## Benchmark application ledger

The [approved benchmark map](../../benchmarks/benchmark-traceability.md#local-application-map)
continues to govern the reviewed components; this evidence ticket does not change dispositions.

| Application / disposition | Local implementation and gate | Verification |
| --- | --- | --- |
| `BM-01`, `BM-02` / Adopt | Existing shell/essential actions, urgent separation and protected Level 0; real contacts/labels remain gated | Full shell/action keyboard, responsive, no-JS and protected-context checks |
| `BM-03`, `BM-04` / Adapt | Existing bounded synthetic search and governed doctor/service/location cards; real vocabulary/relationships remain gated | Search pagination/filter/history and governed-card variants/retirement checks |
| `BM-05` / Adapt; `BM-06` / Adopt | Existing synthetic forms, receipt/warning/failure contracts and recovery; appointment workflow/collection and staffed contacts remain gated | Invalid-summary focus, retention, no false acceptance and no-JS locks; unknown-outcome protected policy checked, real workflow absent |
| `BM-07`, `BM-08` / Adapt | Existing composed stage plane and complete synthetic text directions with inert provider; real stage/arrival guidance gated | Level 2/static fallback, map states/activation/removal/revocation and print |
| `BM-09` / Adapt; `BM-10` / Adopt | Honest unavailable language switch plus explicitly unreviewed shaping stress, semantic labels, reflow and bounded first-party bytes | English/Amharic shaping capability matrix and full interaction suite; human language/AT/physical-device acceptance pending |
| `BM-11` / Adopt; `BM-12`, `BM-13` / Adapt | Existing review/retirement metadata and expiring notice specimens; institutional claims omitted and authentic facts gated | Governed-card public gate, omission/expiry and alert/status metadata/precedence checks |
| `BM-14`, `BM-15`, `BM-17` / Defer; `BM-16` / Test | Coordination, portals, clinical routing and finance promises remain absent | Production exclusion/negative routes; no scope/disposition promotion |

**Deviation:** None. Implementations remain those accepted under `B01-005`–`B01-012`; this harness
adds original review/evidence tooling and cannot authorize a Test/Defer transfer.

**Local verification:** Full `pnpm verify` passed, including production build, semantic accessibility
smoke, runtime/security headers, component contracts, original browser checks and the combined
harness matrix. Production output remains `/`, `/_not-found`, and `/health`, with 146,077 compressed
JavaScript bytes, 183,161 initial compressed bytes, 15 initial requests and zero external origins.
Reachable-history secret scan passed. The sandboxed advisory request returned incomplete JSON;
the approved unrestricted refresh passed for 650 dependencies with zero moderate/high/critical
known vulnerabilities. Final focused bilingual keyboard and capture verification also passes below.

**Media metadata:** Local `ffprobe` identifies the abstract fixture as WebM/VP9, exactly 2 seconds
and 1,196 source bytes; caption file is 82 bytes. The report derives the codec from the WebM codec
identifier. Written posters are included in server HTML and add zero separate poster-asset bytes.

**Defect/retest:** The additional bilingual keyboard pass initially failed to activate the local map
launcher using a raw Enter key-down. The shared passing map test uses a full key-down with carriage
return text. The new helper now follows that native Enter sequence; the final English and Amharic keyboard retests pass.
The original 90 capability/viewport cases and finite-media/history checks passed independently.

**Final browser/capture closeout:** The complete shared interaction suite and 92 combined cases
pass, including keyboard menu/Escape, invalid-summary focus, explicit map acknowledgement/Preview/
Remove, deliberate media Play/Replay, real finite playback end, page exit and Back/Forward in both
language modes. Chromium rejected one capture during the intermediate run; overview screenshots
now stay within the viewport, and component captures use integer geometry and bounded retries.
The final run regenerated all 46 captures and the
[JSON report](b01-013-rendered/b01-013-review-report.json) successfully, with both defects retested.

The 41 rendering components are inventoried in nine groups. The largest observed initial review
specimens are 28,107 gzip bytes (English) and 28,749 (Amharic shaping), with 3,626 gzip JavaScript
bytes, nine initial requests and zero external origins. The motion enhancement is 3,608 source /
982 gzip bytes. The activated media is 1,196 bytes plus 82 caption bytes; no video/caption request
occurs before intent. No external runtime or provider is introduced.

Visual review covered compact mixed-script forms, governed cards and the actual shell header,
plus wide static media and the review overview. Consequential labels wrap; native controls,
neutral fallbacks, written posters, protected urgent content and retired-action omission remain
complete. No open local defect remains. Physical devices, human AT, actual zoom, consequential
Amharic meaning and production performance are not certified by these local automated cases.

**Repository review:** [Issue `#26`](https://github.com/dynamicet/hallelujah-website/issues/26) and
[draft PR `#27`](https://github.com/dynamicet/hallelujah-website/pull/27) track the scoped implementation
commit `610a3cb` and exact-head hosted `T1`. The latest successful run and matching SHA are recorded
in the tracker before merge; this local narrative does not substitute for that current-head gate.
Client controlled-development acceptance remains pending.

**Hosted reconstruction retest:** [Run `35072820457`](https://github.com/dynamicet/hallelujah-website/actions/runs/35072820457)
passed the full hosted implementation verification for `817653c`, but its isolated clean rebuild
failed the no-JavaScript browser request assertion while every semantic/state/collection lock
passed. Request diagnostics now show protocol/origin/path without query values, and the checker
classifies embedded data-image/about-blank events separately from actual transfers. Negative
cases continue to reject external HTTP, other loopback ports, files, blobs and non-image data.
The corrected clean-build gate must pass on the new exact head before merge; no hosted pass or
client acceptance is inferred from the earlier implementation-only success.

## Controlled-development acceptance and hosted closeout

The client, workspace identity `befikadusata`, directed review and closure of `B01-013` and draft
PR `#27` on 16 September 2026, Africa/Addis_Ababa, accepting the controlled-development outcome
under the existing temporary Designer/Frontend/QA roles and working `B00-016` matrix. This records
In review → Done for controlled development.

[Hosted implementation run `35073807049`](https://github.com/dynamicet/hallelujah-website/actions/runs/35073807049)
succeeded for `703ccb4d3507b42cd88f4a8ba958251da0cc23b0`, matching the reviewed PR head. Every
step passed: frozen install, fail-closed controls, history-aware secret scan, dependency audit,
full `pnpm verify`, and isolated clean reconstruction with repeated verification. This successful
run resolves the earlier reconstruction failure recorded above. Repository review found no
review comments or unresolved threads and no open controlled-development defect.

The final acceptance-documentation head must repeat `quality-and-security` before merge; the
matching final SHA/run and merge result belong in the tracker. Production acceptance remains
deferred for professional language review, physical devices, human AT, actual zoom, authentic
image/font loss and production performance. No publication or other gated authority is granted.
