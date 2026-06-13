const BASE = '/flask';

export interface FlaskStatus {
  running: boolean;
  serial: string | null;
  first: string | null;
  last: string | null;
}

export interface FlaskTotp {
  code?: string;
  secs_left?: number;
  error?: string;
}

export async function fetchStatus(): Promise<FlaskStatus | null> {
  try {
    const res = await fetch(`${BASE}/status`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchLog(lines = 600): Promise<string | null> {
  try {
    const res = await fetch(`${BASE}/log?n=${lines}`, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

export async function postRun(row: string, serial: string): Promise<boolean> {
  try {
    const body = new URLSearchParams({ row, serial });
    const res = await fetch(`${BASE}/run`, {
      method: 'POST',
      body,
      redirect: 'manual',
      signal: AbortSignal.timeout(6000),
    });
    return res.ok || res.type === 'opaqueredirect';
  } catch {
    return false;
  }
}

export async function postRunAll(
  serial: string,
  cap: number,
  batch: number,
  gap: number
): Promise<boolean> {
  try {
    const body = new URLSearchParams({
      serial,
      cap: String(cap),
      batch: String(batch),
      gap: String(gap),
    });
    const res = await fetch(`${BASE}/run_all`, {
      method: 'POST',
      body,
      redirect: 'manual',
      signal: AbortSignal.timeout(6000),
    });
    return res.ok || res.type === 'opaqueredirect';
  } catch {
    return false;
  }
}

export async function postRunAllDevices(
  cap: number,
  batch: number,
  gap: number
): Promise<boolean> {
  try {
    const body = new URLSearchParams({
      cap: String(cap),
      batch: String(batch),
      gap: String(gap),
    });
    const res = await fetch(`${BASE}/run_all_devices`, {
      method: 'POST',
      body,
      redirect: 'manual',
      signal: AbortSignal.timeout(6000),
    });
    return res.ok || res.type === 'opaqueredirect';
  } catch {
    return false;
  }
}

export async function getStop(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/stop`, {
      redirect: 'manual',
      signal: AbortSignal.timeout(4000),
    });
    return res.ok || res.type === 'opaqueredirect';
  } catch {
    return false;
  }
}

export async function fetchTotp(handle: string): Promise<FlaskTotp | null> {
  try {
    const res = await fetch(`${BASE}/totp/${encodeURIComponent(handle)}`, {
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
