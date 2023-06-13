// 设置通用对象
export function setObject(key: any, obj: object) {
  if (!key || !obj) return;
  localStorage.removeItem(key);
  localStorage.setItem(key, JSON.stringify(obj));
}

export function getObject(key: any) {
  const item = localStorage.getItem(key);
  if (!item) {
    return item;
  }
  return JSON.parse(item);
}

export function getOneObject(key: any) {
  if (!key) return null;
  const item = localStorage.getItem(key);
  localStorage.removeItem(key);
  if (!item) {
    return item;
  }
  return JSON.parse(item);
}
