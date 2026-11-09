import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { replaceFile } from '../core/replace-file.js';

const directory = '.data/aibi/tokens';
const fileFor = (path: string) => join(directory, `${createHash('sha256').update(path).digest('hex')}.json`);
type Capture = { request?: { startLine?: string }; response?: { startLine?: string; body?: string } };

function tokenBody(body: unknown): body is string {
    if (typeof body !== 'string') return false;
    try {
        const reply = JSON.parse(body) as { access_token?: unknown };
        return typeof reply.access_token === 'string' && reply.access_token.length > 0;
    } catch {
        return false;
    }
}

/** Keep the exact vendor reply; accepting an expired token remains a firmware experiment. */
export async function rememberTokenReply(path: string, body: string): Promise<boolean> {
    if (!path.startsWith('/token/') || !tokenBody(body)) return false;
    await mkdir(directory, { recursive: true, mode: 0o700 });
    const file = fileFor(path);
    const temporary = `${file}.${randomUUID()}.tmp`;
    await writeFile(temporary, JSON.stringify({ path, body, savedAt: new Date().toISOString() }), { mode: 0o600 });
    await replaceFile(temporary, file);
    return true;
}

async function capturedReply(file: string, path: string): Promise<string | undefined> {
    let record: Capture;
    try {
        record = JSON.parse(await readFile(file, 'utf8')) as Capture;
    } catch {
        return undefined;
    }
    const line = record.request?.startLine ?? '';
    if (!line.startsWith(`GET ${path} `) && !line.startsWith(`GET ${path}?`)) return undefined;
    const response = record.response ?? {};
    if (!/^HTTP\/\S+ 200(?: |$)/.test(response.startLine ?? '')) return undefined;
    return tokenBody(response.body) ? response.body : undefined;
}

export async function cachedTokenReply(path: string, traffic: string): Promise<Buffer | undefined> {
    try {
        const saved = JSON.parse(await readFile(fileFor(path), 'utf8')) as { path?: string; body?: string };
        if (saved.path === path && tokenBody(saved.body)) return Buffer.from(saved.body);
    } catch {
        // An existing capture can migrate the old installation's login state once.
    }
    const names = (await readdir(traffic).catch(() => [] as string[]))
        .filter((name) => name.endsWith('.json'))
        .sort()
        .reverse();
    for (const name of names) {
        const body = await capturedReply(join(traffic, name), path);
        if (!body) continue;
        await rememberTokenReply(path, body);
        return Buffer.from(body);
    }
    return undefined;
}
