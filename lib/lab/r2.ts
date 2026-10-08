import 'server-only';
import { AwsClient } from 'aws4fetch';

// Signed, read-only GETs against the private lab bucket. The key is always one of four
// constants: nothing from a request ever reaches the URL.

export const LAB_KEYS = ['v1/now.json', 'v1/history.json', 'v1/threats.json', 'v1/threats-live.json'] as const;
export type LabKey = (typeof LAB_KEYS)[number];

export type R2Failure = 'unconfigured' | 'timeout' | 'network' | 'status' | 'oversize';
export type R2Result = { ok: true; body: string } | { ok: false; reason: R2Failure; status?: number };

const TIMEOUT_MS = 3000;

let client: { aws: AwsClient; base: string } | null = null;
let clientEnv = '';

function getClient(): { aws: AwsClient; base: string } | null {
  const { R2_ACCOUNT_ID, R2_LAB_BUCKET, R2_LAB_READ_KEY_ID, R2_LAB_READ_SECRET } = process.env;
  if (!R2_ACCOUNT_ID || !R2_LAB_BUCKET || !R2_LAB_READ_KEY_ID || !R2_LAB_READ_SECRET) return null;
  const env = [R2_ACCOUNT_ID, R2_LAB_BUCKET, R2_LAB_READ_KEY_ID, R2_LAB_READ_SECRET].join('\n');
  if (!client || env !== clientEnv) {
    client = {
      aws: new AwsClient({
        accessKeyId: R2_LAB_READ_KEY_ID,
        secretAccessKey: R2_LAB_READ_SECRET,
        service: 's3',
        region: 'auto',
        // aws4fetch retries 5xx up to 10 times by default; one read per cache window is enough
        retries: 0,
      }),
      base: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_LAB_BUCKET}`,
    };
    clientEnv = env;
  }
  return client;
}

export async function getObject(key: LabKey, maxBytes: number): Promise<R2Result> {
  const c = getClient();
  if (!c) return { ok: false, reason: 'unconfigured' };
  let res: Response;
  try {
    res = await c.aws.fetch(`${c.base}/${key}`, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (err) {
    return { ok: false, reason: isTimeout(err) ? 'timeout' : 'network' };
  }
  if (res.status !== 200) {
    await res.body?.cancel().catch(() => {});
    return { ok: false, reason: 'status', status: res.status };
  }
  const declared = Number(res.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > maxBytes) {
    await res.body?.cancel().catch(() => {});
    return { ok: false, reason: 'oversize' };
  }
  try {
    const body = await readCapped(res, maxBytes);
    return body === null ? { ok: false, reason: 'oversize' } : { ok: true, body };
  } catch (err) {
    return { ok: false, reason: isTimeout(err) ? 'timeout' : 'network' };
  }
}

/** The body as text, or null once it passes maxBytes (the read stops there). */
async function readCapped(res: Response, maxBytes: number): Promise<string | null> {
  if (!res.body) return '';
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel().catch(() => {});
      return null;
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

function isTimeout(err: unknown): boolean {
  return err instanceof Error && (err.name === 'TimeoutError' || err.name === 'AbortError');
}
