import { ArrowLeft, Edit, Trash2, ExternalLink, Calendar } from 'lucide-react';
import { Navigation } from './Navigation';
import type { Partnership } from '../App';

type DetailScreenProps = {
  partnership: Partnership;
  onBack: () => void;
  onNavigateToPermissions: () => void;
};

export function DetailScreen({ partnership, onBack, onNavigateToPermissions }: DetailScreenProps) {
  const handleEdit = () => {
    alert('Bearbeiten-Funktion würde hier die Eingabeformulare öffnen.');
  };

  const handleDelete = () => {
    if (confirm(`Möchten Sie diese Partnerschaft wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`)) {
      alert('Löschen-Funktion nur für Admin verfügbar.');
    }
  };

  const kooperationColors = {
    'Keine': 'bg-gray-100 text-gray-800',
    'Geplant': 'bg-yellow-100 text-yellow-800',
    'Aktiv': 'bg-green-100 text-green-800',
    'Abgeschlossen': 'bg-blue-100 text-blue-800'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onNavigateToPermissions={onNavigateToPermissions} />
      
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
                  <div className="text-gray-900">{partnership.gruendungsjahr}</div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Bisherige Kooperation</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${kooperationColors[partnership.bisherigeKooperation]}`}>
                    {partnership.bisherigeKooperation}
                  </span>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Datum
                  </label>
                  <div className="text-gray-900">
                    {new Date(partnership.datum).toLocaleDateString('de-DE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
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
                  </ul>
                </div>

                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm text-gray-600 mb-1.5">Bemerkungen</label>
                  <div className="text-gray-900 bg-gray-50 rounded-lg p-3 border border-gray-200">
                    {partnership.bemerkungen}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Ansprechpartner*in</label>
                  <div className="text-gray-900">{partnership.parkAnsprechpartner}</div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1.5">Kontaktdetails</label>
                  <div className="text-gray-900">{partnership.kontaktdetails}</div>
                </div>

                <div className="md:col-span-2 lg:col-span-3">
                  <label className="block text-sm text-gray-600 mb-1.5">Webpräsenz</label>
                  <a
                    href={partnership.webpraesenz}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {partnership.webpraesenz}
                    <ExternalLink className="w-4 h-4" />
                  </a>
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
                  <div className="text-gray-900">{partnership.standort}</div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-2">Fakultäten</label>
                  <ul className="space-y-1.5">
                    {partnership.fakultaeten.map((fakultaet, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="inline-block w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-gray-900">{fakultaet}</span>
                      </li>
                    ))}
                  </ul>
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
                  </ul>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Ansprechpartner</label>
                  <div className="text-gray-900">{partnership.uniAnsprechpartner}</div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Website</label>
                  <a
                    href={partnership.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {partnership.website}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Bearbeiten
            </button>
            
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Löschen (nur Admin)
            </button>

            <div className="ml-auto flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Ihre Rolle erlaubt Bearbeiten
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
