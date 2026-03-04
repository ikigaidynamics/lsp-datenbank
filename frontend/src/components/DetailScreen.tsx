import { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Edit, Trash2, ExternalLink, Calendar, X, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Navigation } from './Navigation';
import { EditPartnershipForm } from './overview/EditPartnershipForm';
import { getPartnership, deletePartnership, updatePartnership } from '@/api/partnerships';
import { useEditForm } from '@/hooks/useEditForm';
import { KOOPERATION_COLORS } from '@/lib/constants';
import type { Partnership } from '@/api/types';
import type { useAuth } from '@/hooks/useAuth';

type DetailScreenProps = {
  partnershipId: number;
  onBack: () => void;
  onNavigateToPermissions: () => void;
  auth: ReturnType<typeof useAuth>;
};

export function DetailScreen({ partnershipId, onBack, onNavigateToPermissions, auth }: DetailScreenProps) {
  const [partnership, setPartnership] = useState<Partnership | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPartnership(partnershipId);
      setPartnership(data);
    } catch {
      setError('Partnerschaft konnte nicht geladen werden.');
    } finally {
      setIsLoading(false);
    }
  }, [partnershipId]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!partnership) return;
    if (!confirm('Möchten Sie diese Partnerschaft wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.')) return;
    try {
      await deletePartnership(partnership.id);
      toast.success('Partnerschaft gelöscht.');
      onBack();
    } catch {
      toast.error('Fehler beim Löschen.');
    }
  };

  const canEdit = auth.hasRole('readwrite');
  const canDelete = auth.hasRole('admin');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation user={auth.user!} onNavigateToPermissions={onNavigateToPermissions} onLogout={auth.logout} onUpdateProfile={auth.updateProfile} />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-gray-500">Laden...</p>
        </div>
      </div>
    );
  }

  if (error || !partnership) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation user={auth.user!} onNavigateToPermissions={onNavigateToPermissions} onLogout={auth.logout} onUpdateProfile={auth.updateProfile} />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Zurück zur Übersicht</span>
          </button>
          <p className="text-red-600">{error ?? 'Partnerschaft nicht gefunden.'}</p>
        </div>
      </div>
    );
  }

  const kooperationClass = partnership.bisherigeKooperation
    ? KOOPERATION_COLORS[partnership.bisherigeKooperation]
    : 'bg-gray-100 text-gray-800';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={auth.user!} onNavigateToPermissions={onNavigateToPermissions} onLogout={auth.logout} onUpdateProfile={auth.updateProfile} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Zurück zur Übersicht</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-gray-900 mb-2">Detailansicht – Partnerschaft</h2>
          <p className="text-gray-600">{partnership.parkName} & {partnership.universitaetName}</p>
        </div>

        {isEditing && partnership ? (
          <DetailEditMode
            partnership={partnership}
            isSaving={isSaving}
            onSave={async (changes) => {
              setIsSaving(true);
              try {
                const updated = await updatePartnership(partnership.id, changes);
                setPartnership(updated);
                setIsEditing(false);
                toast.success('Partnerschaft aktualisiert.');
              } catch {
                toast.error('Fehler beim Speichern.');
              } finally {
                setIsSaving(false);
              }
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            {/* Two main sections */}
            <div className="space-y-6">
              {/* Science Park Section */}
              <div className="bg-white rounded-xl shadow-sm border-2 border-blue-200 overflow-hidden">
                <div className="bg-blue-50 px-6 py-4 border-b-2 border-blue-200">
                  <h3 className="text-gray-900">Lausitz Science Park: Partnerparks und Kooperationsprojekte</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1.5">Name</label>
                      <div className="text-gray-900">{partnership.parkName}</div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1.5">Land</label>
                      <div className="text-gray-900">{partnership.land}</div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1.5">Stadt</label>
                      <div className="text-gray-900">{partnership.stadt}</div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1.5">Gründungsjahr</label>
                      <div className="text-gray-900">{partnership.gruendungsjahr ?? '—'}</div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1.5">Bisherige Kooperation</label>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${kooperationClass}`}>
                        {partnership.bisherigeKooperation ?? '—'}
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1.5 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        Datum
                      </label>
                      <div className="text-gray-900">
                        {partnership.datum
                          ? new Date(partnership.datum).toLocaleDateString('de-DE', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : '—'}
                      </div>
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-sm text-gray-600 mb-2">Themen</label>
                      <ul className="space-y-1.5">
                        {partnership.themen.map((thema, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-gray-900">{thema}</span>
                          </li>
                        ))}
                        {partnership.themen.length === 0 && (
                          <li className="text-gray-500">—</li>
                        )}
                      </ul>
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-sm text-gray-600 mb-1.5">Bemerkungen</label>
                      <div className="text-gray-900 bg-gray-50 rounded-lg p-3 border border-gray-200">
                        {partnership.bemerkungen || '—'}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1.5">Ansprechpartner*in</label>
                      <div className="text-gray-900">{partnership.parkAnsprechpartner || '—'}</div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-600 mb-1.5">Kontaktdetails</label>
                      <div className="text-gray-900">{partnership.kontaktdetails || '—'}</div>
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block text-sm text-gray-600 mb-1.5">Webpräsenz</label>
                      {partnership.webpraesenz ? (
                        <a
                          href={partnership.webpraesenz}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {partnership.webpraesenz}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* University Section */}
              <div className="bg-white rounded-xl shadow-sm border-2 border-purple-200 overflow-hidden">
                <div className="bg-purple-50 px-6 py-4 border-b-2 border-purple-200">
                  <h3 className="text-gray-900">Assoziierte Universitäten</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1.5">Name</label>
                      <div className="text-gray-900">{partnership.universitaetName}</div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1.5">Standort</label>
                      <div className="text-gray-900">{partnership.standort || '—'}</div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-600 mb-2">Forschungsschwerpunkte/Expertise</label>
                      <ul className="space-y-1.5">
                        {partnership.forschungsschwerpunkte.map((schwerpunkt, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="inline-block w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-gray-900">{schwerpunkt}</span>
                          </li>
                        ))}
                        {partnership.forschungsschwerpunkte.length === 0 && (
                          <li className="text-gray-500">—</li>
                        )}
                      </ul>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1.5">Ansprechpartner</label>
                      <div className="text-gray-900">{partnership.uniAnsprechpartner || '—'}</div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1.5">Website</label>
                      {partnership.website ? (
                        <a
                          href={partnership.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {partnership.website}
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            {(canEdit || canDelete) && (
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                padding: '24px',
                marginTop: '24px',
              }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                  {canEdit && (
                    <button
                      onClick={() => setIsEditing(true)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        fontWeight: 500,
                        fontSize: '14px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <Edit style={{ width: '16px', height: '16px' }} />
                      Bearbeiten
                    </button>
                  )}

                  {canDelete && (
                    <button
                      onClick={handleDelete}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        backgroundColor: '#ffffff',
                        color: '#dc2626',
                        fontWeight: 500,
                        fontSize: '14px',
                        borderRadius: '8px',
                        border: '1px solid #fca5a5',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 style={{ width: '16px', height: '16px' }} />
                      Löschen
                    </button>
                  )}

                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: canEdit ? '#22c55e' : '#9ca3af',
                    }} />
                    {canEdit ? 'Ihre Rolle erlaubt Bearbeiten' : 'Nur Lesezugriff'}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Separate component so useEditForm hook can be called unconditionally
interface DetailEditModeProps {
  partnership: Partnership;
  isSaving: boolean;
  onSave: (changes: import('@/api/types').PartnershipUpdate) => Promise<void>;
  onCancel: () => void;
}

function DetailEditMode({ partnership, isSaving, onSave, onCancel }: DetailEditModeProps) {
  const { formData, setField, isDirty, reset, getChanges } = useEditForm(partnership);

  const handleSave = async () => {
    if (!formData.parkName.trim() || !formData.land.trim() || !formData.stadt.trim() || !formData.universitaetName.trim()) {
      toast.error('Bitte füllen Sie alle Pflichtfelder aus (Name, Land, Stadt, Universität).');
      return;
    }
    const changes = getChanges();
    if (Object.keys(changes).length === 0) {
      onCancel();
      return;
    }
    await onSave(changes);
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-blue-200 overflow-hidden">
      <div className="bg-blue-50 px-6 py-4 border-b-2 border-blue-200 flex items-center justify-between">
        <h3 className="text-gray-900">Partnerschaft bearbeiten</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCancel}
            disabled={isSaving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              fontSize: '14px',
              fontWeight: 500,
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              backgroundColor: '#ffffff',
              color: '#374151',
              cursor: isSaving ? 'not-allowed' : 'pointer',
            }}
          >
            <X style={{ width: '16px', height: '16px' }} />
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              fontSize: '14px',
              fontWeight: 500,
              borderRadius: '8px',
              border: 'none',
              backgroundColor: !isDirty || isSaving ? '#93c5fd' : '#2563eb',
              color: 'white',
              cursor: !isDirty || isSaving ? 'not-allowed' : 'pointer',
            }}
          >
            <Save style={{ width: '16px', height: '16px' }} />
            {isSaving ? 'Speichern...' : 'Speichern'}
          </button>
        </div>
      </div>
      <div className="p-6">
        <EditPartnershipForm formData={formData} onFieldChange={setField} />
      </div>
    </div>
  );
}
