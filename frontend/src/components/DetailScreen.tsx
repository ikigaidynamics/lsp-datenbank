import { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Edit, Trash2, ExternalLink, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Navigation } from './Navigation';
import { getPartnership, deletePartnership } from '@/api/partnerships';
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
        <Navigation user={auth.user!} onNavigateToPermissions={onNavigateToPermissions} onLogout={auth.logout} />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-gray-500">Laden...</p>
        </div>
      </div>
    );
  }

  if (error || !partnership) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation user={auth.user!} onNavigateToPermissions={onNavigateToPermissions} onLogout={auth.logout} />
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
      <Navigation user={auth.user!} onNavigateToPermissions={onNavigateToPermissions} onLogout={auth.logout} />

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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <div className="flex flex-wrap gap-3">
              {canEdit && (
                <button
                  onClick={() => toast.info('Bearbeiten-Funktion wird in einer zukünftigen Version verfügbar.')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Bearbeiten
                </button>
              )}

              {canDelete && (
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Löschen
                </button>
              )}

              <div className="ml-auto flex items-center gap-2 text-sm text-gray-500">
                <div className={`w-2 h-2 rounded-full ${canEdit ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                {canEdit ? 'Ihre Rolle erlaubt Bearbeiten' : 'Nur Lesezugriff'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
