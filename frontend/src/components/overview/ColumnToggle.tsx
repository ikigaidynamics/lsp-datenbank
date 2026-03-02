import { useState, useRef, useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';

type ColumnDef = {
  key: string;
  label: string;
};

const PARK_COLUMNS: ColumnDef[] = [
  { key: 'parkName', label: 'Name' },
  { key: 'land', label: 'Land' },
  { key: 'stadt', label: 'Stadt' },
  { key: 'gruendungsjahr', label: 'Gründungsjahr' },
  { key: 'bisherigeKooperation', label: 'Bisherige Kooperation' },
  { key: 'datum', label: 'Datum' },
  { key: 'themen', label: 'Themen' },
  { key: 'bemerkungen', label: 'Bemerkungen' },
  { key: 'parkAnsprechpartner', label: 'Ansprechpartner*in' },
  { key: 'kontaktdetails', label: 'Kontaktdetails' },
  { key: 'webpraesenz', label: 'Webpräsenz' },
];

const UNI_COLUMNS: ColumnDef[] = [
  { key: 'universitaetName', label: 'Name' },
  { key: 'standort', label: 'Standort' },
  { key: 'forschungsschwerpunkte', label: 'Forschungsschwerpunkte' },
  { key: 'uniAnsprechpartner', label: 'Ansprechpartner' },
];

export const PARK_KEYS = PARK_COLUMNS.map(c => c.key);
export const UNI_KEYS = UNI_COLUMNS.map(c => c.key);

interface ColumnToggleProps {
  hiddenColumns: Set<string>;
  onToggle: (key: string) => void;
}

export function ColumnToggle({ hiddenColumns, onToggle }: ColumnToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const hiddenCount = hiddenColumns.size;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          fontSize: '14px',
          borderRadius: '8px',
          border: '1px solid #d1d5db',
          backgroundColor: isOpen ? '#f3f4f6' : '#ffffff',
          color: '#374151',
          cursor: 'pointer',
        }}
        title="Spalten ein-/ausblenden"
      >
        <SlidersHorizontal style={{ width: '16px', height: '16px' }} />
        Spalten
        {hiddenCount > 0 && (
          <span style={{
            backgroundColor: '#2563eb',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 600,
            borderRadius: '9999px',
            padding: '1px 6px',
            minWidth: '18px',
            textAlign: 'center',
          }}>
            {hiddenCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '4px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
          padding: '8px 0',
          zIndex: 40,
          minWidth: '250px',
          maxHeight: '420px',
          overflowY: 'auto',
        }}>
          <div style={{ padding: '4px 12px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Partnerparks
          </div>
          {PARK_COLUMNS.map(col => (
            <label
              key={col.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 12px',
                cursor: 'pointer',
                fontSize: '13px',
                color: hiddenColumns.has(col.key) ? '#9ca3af' : '#374151',
              }}
            >
              <input
                type="checkbox"
                checked={!hiddenColumns.has(col.key)}
                onChange={() => onToggle(col.key)}
                style={{ accentColor: '#2563eb', width: '14px', height: '14px' }}
              />
              {col.label}
            </label>
          ))}

          <div style={{ borderTop: '1px solid #e5e7eb', margin: '6px 0' }} />

          <div style={{ padding: '4px 12px', fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Universitäten
          </div>
          {UNI_COLUMNS.map(col => (
            <label
              key={col.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 12px',
                cursor: 'pointer',
                fontSize: '13px',
                color: hiddenColumns.has(col.key) ? '#9ca3af' : '#374151',
              }}
            >
              <input
                type="checkbox"
                checked={!hiddenColumns.has(col.key)}
                onChange={() => onToggle(col.key)}
                style={{ accentColor: '#2563eb', width: '14px', height: '14px' }}
              />
              {col.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
