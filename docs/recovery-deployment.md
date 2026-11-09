# Recovery deployment

Build and qualify on the development host. Deploy only a verified commit on the owner's fork main; do not rebuild from an older production source checkout. Preserve `.env`, `policy.json`, all `.data`, TLS identity and unrelated services.

1. Record the production source HEAD, tracked/untracked status, service PID/label and SHA256 of all runtime files. Confirm no competing service operation.
2. Build `dist` locally with the locked dependencies; run the existing validation and token-retention qualification. Publish the tested source to the owner's fork and verify the remote main SHA.
3. Stage the built `dist` archive and its SHA256 on the host. Keep a private release directory with the previous `dist`, source SHA and configuration backups. Do not restore old runtime data during rollback.
4. Fetch the owner's fork; fast-forward the production main checkout to the exact verified SHA. Retain the former source branch and untracked files. Set production main to track the owner's fork/main.
5. With the selected service operation authorized, atomically replace the dist directory, seed a recovered matching login reply into `.data/aibi/tokens` using a SHA256 hash of its `/token/DEVICE` path as the filename, and restart only the existing Aibinator service. The token JSON is `{path,body,savedAt}`, where body is the exact vendor JSON string; directory0700/file0600. Never commit credentials or use a fake test token in production.
6. Verify process identity, exact source and runtime hashes, unchanged private configuration, DNS answers, fresh robot contact, and local handler behavior. Label agent probes as agent probes. A physical test must establish robot boot, audio upload and audible playback separately.

Rollback: return only the selected service to the prior source and retained dist under the same operational claim; preserve current memory, captures, TLS keys and private login state. Check actual effects before retrying any task or playback. GUI service and route durability are existing limitations; this procedure does not migrate them.
