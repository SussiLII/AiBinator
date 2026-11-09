# Changelog

## 2026-11-10 — Preserve startup credentials and useful AIBI evidence

- Store exact vendor login replies privately under `.data/aibi/tokens`, keyed by the device's token route. Migrate a matching saved capture once, and preserve future successful passthrough login replies. Local mode remains vendor-blocked; it never refreshes a token automatically or rewrites its expiry.
- Successful `/time` heartbeats remain visible in status counters but no longer consume the 1,000-record traffic budget. Failed heartbeats remain captured. DNS activity logs each client once per listener lifetime, keeping boot/voice/errors visible.
- Preserve the existing wildcard DNS bind, source-pinned forwarding, whole-vendor-zone routing, vendor-shaped voice replies and local update-check response. Rebuilding the previous deployed checkout would have lost several of these changes; this release consolidates their source.
- Restore the existing proxy validator's local-mode expectations from the deployed handoff and add meaningful checks for missing tokens, migration, complete traffic-directory deletion, device separation and no vendor request. Full existing offline validation passed with normal local file-watcher access; the sandbox run failed in the unchanged session watcher. TypeScript build and changed-file lint pass. A separate fake-only qualification proves 1,200 successful heartbeats produce no capture churn, failed heartbeats are retained, saved login survives a new process and files are mode0600.
- Physical robot acceptance remains pending. A prior local OTA probe is not evidence of firmware acceptance. Saving an expired token does not establish that the robot accepts it. Codex task-response activation and physical voice/music acceptance are separate next steps.
