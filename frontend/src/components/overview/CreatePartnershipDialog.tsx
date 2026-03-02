import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { EditPartnershipForm } from './EditPartnershipForm';
import type { EditFormData } from '@/hooks/useEditForm';
import type { PartnershipCreate } from '@/api/types';

const EMPTY_FORM: EditFormData = {
  parkName: '',
  land: 'Deutschland',
  stadt: '',
  gruendungsjahr: '',
  bisherigeKooperation: 'Keine',
  datum: '',
  themen: [],
  bemerkungen: '',
  parkAnsprechpartner: '',
  kontaktdetails: '',
  webpraesenz: '',
  universitaetName: '',
  standort: '',
  forschungsschwerpunkte: [],
  uniAnsprechpartner: '',
  website: '',
};

interface CreatePartnershipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: PartnershipCreate) => Promise<unknown>;
}

export function CreatePartnershipDialog({ open, onOpenChange, onCreate }: CreatePartnershipDialogProps) {
  const [formData, setFormData] = useState<EditFormData>({ ...EMPTY_FORM });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) setFormData({ ...EMPTY_FORM });
  }, [open]);

  if (!open) return null;

  const setField = <K extends keyof EditFormData>(key: K, value: EditFormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!formData.parkName.trim() || !formData.land.trim() || !formData.stadt.trim() || !formData.universitaetName.trim()) {
      toast.error('Bitte füllen Sie alle Pflichtfelder aus (Name, Land, Stadt, Universität).');
      return;
    }

    const data: PartnershipCreate = {
      parkName: formData.parkName,
      land: formData.land,
      stadt: formData.stadt,
      gruendungsjahr: formData.gruendungsjahr ? parseInt(formData.gruendungsjahr, 10) : null,
      bisherigeKooperation: formData.bisherigeKooperation as PartnershipCreate['bisherigeKooperation'],
      datum: formData.datum || null,
      themen: formData.themen,
      bemerkungen: formData.bemerkungen || null,
      parkAnsprechpartner: formData.parkAnsprechpartner || null,
      kontaktdetails: formData.kontaktdetails || null,
      webpraesenz: formData.webpraesenz || null,
      universitaetName: formData.universitaetName,
      standort: formData.standort || null,
      forschungsschwerpunkte: formData.forschungsschwerpunkte,
      uniAnsprechpartner: formData.uniAnsprechpartner || null,
      website: formData.website || null,
    };

    setIsSaving(true);
    try {
      await onCreate(data);
      toast.success('Partnerschaft erstellt.');
      onOpenChange(false);
    } catch {
      toast.error('Fehler beim Erstellen.');
    } finally {
      setIsSaving(false);
    }
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
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>Neue Partnerschaft anlegen</h3>
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Pflichtfelder sind mit * markiert.</p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
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
            onClick={() => onOpenChange(false)}
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
            disabled={isSaving}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 500,
              borderRadius: '8px',
              border: 'none',
              backgroundColor: isSaving ? '#93c5fd' : '#2563eb',
              color: 'white',
              cursor: isSaving ? 'not-allowed' : 'pointer',
            }}
          >
            {isSaving ? 'Erstellen...' : 'Erstellen'}
          </button>
        </div>
      </div>
    </div>
  );
}
