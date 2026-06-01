export function get(key: LSKeys): string | null {
  return localStorage.getItem(key);
}

export function set(key: LSKeys, data: any): void {
  const strData = typeof data === 'string' ? data : JSON.stringify(data);
  localStorage.setItem(key, strData);
}

export function del(key: LSKeys): void {
  localStorage.removeItem(key);
}

export function parse<T>(key: LSKeys): T {
  return JSON.parse(get(key)!) as T;
}

export enum LSKeys {
  city = 'city',
}
