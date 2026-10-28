/**
 * api.js - the ONLY place where the frontend talks to the Flask backend.
 * Components never call fetch() directly; they use the `api` object below.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error(
      'Cannot reach the GenWrite server. Make sure the Flask backend is running on port 5000.'
    );
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    /* the response had no JSON body */
  }

  if (!response.ok) {
    throw new Error(data?.error || `Request failed (${response.status}).`);
  }
  return data;
}

export const api = {
  /** Generate new content. Returns the saved history record. */
  generate: ({ topic, contentType, tone }) =>
    request('/generate', {
      method: 'POST',
      body: JSON.stringify({ topic, content_type: contentType, tone }),
    }),

  /** Get all saved content (newest first). */
  getHistory: () => request('/history'),

  /** Delete one saved item. */
  deleteItem: (id) => request(`/delete/${id}`, { method: 'DELETE' }),
};
