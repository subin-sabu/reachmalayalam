// lib/idEncoding.js
export function encodeId(id) {
  return encodeURIComponent(id);
}

export function decodeId(encodedId) {
  return decodeURIComponent(encodedId);
}
