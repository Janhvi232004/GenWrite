import { Fragment } from 'react';

/**
 * A tiny, dependency-free Markdown renderer. It understands only what our AI
 * prompts produce: #/##/### headings, - bullets, 1. lists, **bold**, #hashtags.
 * Everything else is shown as normal paragraphs.
 */

// Highlights **bold** text and #hashtags inside one line of text.
function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*|#[\p{L}\p{N}_]+)/gu);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={i} className="font-semibold text-fg">{part.slice(2, -2)}</strong>;
    }
    if (/^#[\p{L}\p{N}_]+$/u.test(part)) {
      return <span key={i} className="font-medium text-primary dark:text-secondary">{part}</span>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

// Group raw lines into blocks: heading | list | paragraph
function parseBlocks(text) {
  const blocks = [];
  let list = null;

  const flushList = () => {
    if (list) blocks.push(list);
    list = null;
  };

  text.split('\n').forEach((raw) => {
    const line = raw.trimEnd();
    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    const bullet = line.match(/^\s*[-*•]\s+(.*)$/);
    const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/);

    if (heading) {
      flushList();
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] });
    } else if (bullet || numbered) {
      const kind = bullet ? 'ul' : 'ol';
      if (!list || list.kind !== kind) {
        flushList();
        list = { type: 'list', kind, items: [] };
      }
      list.items.push((bullet || numbered)[1]);
    } else if (line.trim() === '') {
      flushList();
    } else {
      flushList();
      blocks.push({ type: 'p', text: line });
    }
  });
  flushList();
  return blocks;
}

export default function MarkdownText({ text, className = '' }) {
  const blocks = parseBlocks(text);

  return (
    <div className={`space-y-3.5 text-[15px] leading-7 text-fg/85 ${className}`}>
      {blocks.map((block, i) => {
        if (block.type === 'heading') {
          const size = block.level === 1 ? 'text-2xl' : block.level === 2 ? 'text-xl' : 'text-lg';
          return (
            <h3 key={i} className={`${size} pt-1 font-display font-bold leading-snug text-fg`}>
              {renderInline(block.text)}
            </h3>
          );
        }
        if (block.type === 'list') {
          const Tag = block.kind;
          return (
            <Tag
              key={i}
              className={`space-y-1.5 pl-6 marker:text-secondary ${block.kind === 'ul' ? 'list-disc' : 'list-decimal'}`}
            >
              {block.items.map((item, j) => (
                <li key={j}>{renderInline(item)}</li>
              ))}
            </Tag>
          );
        }
        return <p key={i}>{renderInline(block.text)}</p>;
      })}
    </div>
  );
}
