# Changelog

## 2026-11-10 — Prepare Codex reviewer inheritance

The task adapter forced human review even when the account had automatic review configured. It now omits that override and inherits the configured reviewer while retaining on-request approvals. Updated the shared adapter fixture's old human-review expectation; the first adapter run exposed that stale assertion, and the corrected adapter checks, TypeScript build, changed-file lint and formatting now pass. An isolated local Codex0.167.0 ephemeral thread returned approvalsReviewer=auto_review and approvalPolicy=on-request with the reviewer omitted; no model turn or provider credentials were used. The installed protocol schema describes this field as an override. Actual production session settings still need verification on activation.

This change is prepared on a branch, not activated; the task responder remains disabled until basic voice acceptance. The host service needs its executable search path to include the existing Codex wrapper. The prepared operator settings must explicitly confirm exclusive local ownership, use a separate workspace and private app-server, and disable shared conversation reuse. Activation instructions are in docs/recovery-deployment.md. Official protocol reference: https://learn.chatgpt.com/docs/app-server .

## 2026-11-10 — Recovery release activated

Source4fbe55d is on the owner fork main and active on the selected host. All233 built files match the manifest. Existing private configuration and memory were preserved; the archived token matches the robot identity. Fresh robot HTTPS heartbeats and DNS were observed. Trusted-CA localhost token/update probes returned200; physical boot, audio and playback acceptance remain pending. The restored token is expired, so acceptance is still experimental. The Codex responder is still disabled.

## 2026-11-10 — Preserve startup credentials and useful AIBI evidence

- Store exact vendor login replies privately under `.data/aibi/tokens`, keyed by the device's token route. Migrate a matching saved capture once, and preserve future successful passthrough login replies. Local mode remains vendor-blocked; it never refreshes a token automatically or rewrites its expiry.
- Successful `/time` heartbeats remain visible in status counters but no longer consume the 1,000-record traffic budget. Failed heartbeats remain captured. DNS activity logs each client once per listener lifetime, keeping boot/voice/errors visible.
- Preserve the existing wildcard DNS bind, source-pinned forwarding, whole-vendor-zone routing, vendor-shaped voice replies and local update-check response. Rebuilding the previous deployed checkout would have lost several of these changes; this release consolidates their source.
- Restore the existing proxy validator's local-mode expectations from the deployed handoff and add meaningful checks for missing tokens, migration, complete traffic-directory deletion, device separation and no vendor request. Full existing offline validation passed with normal local file-watcher access; the sandbox run failed in the unchanged session watcher. TypeScript build and changed-file lint pass. A separate fake-only qualification proves 1,200 successful heartbeats produce no capture churn, failed heartbeats are retained, saved login survives a new process and files are mode0600.
- Physical robot acceptance remains pending. A prior local OTA probe is not evidence of firmware acceptance. Saving an expired token does not establish that the robot accepts it. Codex task-response activation and physical voice/music acceptance are separate next steps.
