import { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { EditPartnershipForm } from './EditPartnershipForm';
import { useEditForm } from '@/hooks/useEditForm';
import type { Partnership, PartnershipUpdate } from '@/api/types';

interface EditPartnershipDialogProps {
  partnership: Partnership;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: number, data: PartnershipUpdate) => Promise<Partnership>;
}

export function EditPartnershipDialog({ partnership, open, onOpenChange, onSave }: EditPartnershipDialogProps) {
  const { formData, setField, isDirty, reset, getChanges } = useEditForm(partnership);
  const [isSaving, setIsSaving] = useState(false);

  if (!open) return null;

  const handleSave = async () => {
    if (!formData.parkName.trim() || !formData.land.trim() || !formData.stadt.trim() || !formData.universitaetName.trim()) {
      toast.error('Bitte füllen Sie alle Pflichtfelder aus (Name, Land, Stadt, Universität).');
      return;
    }

    const changes = getChanges();
    if (Object.keys(changes).length === 0) {
      onOpenChange(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(partnership.id, changes);
      toast.success('Partnerschaft aktualisiert.');
      onOpenChange(false);
    } catch {
      toast.error('Fehler beim Speichern.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onOpenChange(false); }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          width: '100%',
          maxWidth: '700px',
          maxHeight: '85vh',
          overflowY: 'auto',
          margin: '16px',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px 0',
        }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>Partnerschaft bearbeiten</h3>
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
              {partnership.parkName} &amp; {partnership.universitaetName}
            </p>
          </div>
          <button
            onClick={handleCancel}
            style={{
              padding: '4px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: '#9ca3af',
            }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: '20px 24px' }}>
          <EditPartnershipForm formData={formData} onFieldChange={setField} />
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px',
          padding: '16px 24px',
          borderTop: '1px solid #e5e7eb',
        }}>
          <button
            type="button"
            onClick={handleCancel}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 500,
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              backgroundColor: '#ffffff',
              color: '#374151',
              cursor: 'pointer',
            }}
          >
            Abbrechen
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 500,
              borderRadius: '8px',
              border: 'none',
              backgroundColor: !isDirty || isSaving ? '#93c5fd' : '#2563eb',
              color: 'white',
              cursor: !isDirty || isSaving ? 'not-allowed' : 'pointer',
            }}
          >
            {isSaving ? 'Speichern...' : 'Speichern'}
          </button>
        </div>
      </div>
    </div>
  );
}
