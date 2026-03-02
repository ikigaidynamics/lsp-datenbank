import { useState, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  colorClass?: string;
}

export function TagInput({ value, onChange, placeholder = 'Eingabe + Enter', colorClass = 'bg-blue-100 text-blue-800' }: TagInputProps) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
    if (e.key === 'Backspace' && input === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '8px 10px', border: '1px solid #d1d5db', borderRadius: '8px', backgroundColor: '#fff', minHeight: '42px', minWidth: '280px' }}>
      {value.map((tag, index) => (
        <span
          key={index}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${colorClass}`}
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="hover:opacity-70 flex-shrink-0"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={value.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
      />
    </div>
  );
}
