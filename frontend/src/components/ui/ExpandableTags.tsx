import { useState } from 'react';

interface ExpandableTagsProps {
  items: string[];
  limit?: number;
  colorClass?: string;
}

export function ExpandableTags({ items, limit = 2, colorClass = 'bg-blue-100 text-blue-800' }: ExpandableTagsProps) {
  const [expanded, setExpanded] = useState(false);

  if (items.length === 0) return <span className="text-gray-400">—</span>;

  const visible = expanded ? items : items.slice(0, limit);
  const hiddenCount = items.length - limit;

  return (
    <div className="flex flex-wrap gap-1 max-w-[200px]">
      {visible.map((item, index) => (
        <span
          key={index}
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${colorClass}`}
        >
          {item}
        </span>
      ))}
      {hiddenCount > 0 && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 cursor-pointer transition-colors"
        >
          +{hiddenCount}
        </button>
      )}
      {expanded && items.length > limit && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 cursor-pointer transition-colors"
        >
          weniger
        </button>
      )}
    </div>
  );
}
