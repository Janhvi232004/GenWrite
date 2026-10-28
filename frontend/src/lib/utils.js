import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind class names safely (ShadCN convention). */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Number of words in a piece of text. */
export function countWords(text = '') {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

/** Number of characters in a piece of text. */
export function countChars(text = '') {
  return text.length;
}

/** "12 Mar 2026 · 04:30 PM" */
export function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const date = d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  return `${date} · ${time}`;
}

/** "5 min ago", "2 hours ago", "3 days ago" */
export function timeAgo(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const seconds = Math.max(0, Math.floor((Date.now() - d.getTime()) / 1000));
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

/** Turn a topic into a safe file name part. */
export function slugify(text = '') {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return slug || 'content';
}

/** Download text as a .txt file. */
export function downloadTxt(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/** Copy text to the clipboard (with an old-browser fallback). */
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement('textarea');
      area.value = text;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand('copy');
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

/** Remove Markdown symbols so a short plain-text preview looks clean. */
export function stripMarkdown(text = '') {
  return text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/^\s*[-*•]\s+/gm, '')
    .replace(/`/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
