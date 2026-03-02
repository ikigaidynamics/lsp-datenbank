import { useState } from 'react';
import { Search, Filter, ExternalLink, Eye } from 'lucide-react';
import { Navigation } from './Navigation';
import type { Partnership } from '../App';

type OverviewScreenProps = {
  data: Partnership[];
  onViewDetail: (partnership: Partnership) => void;
  onNavigateToPermissions: () => void;
};

export function OverviewScreen({ data, onViewDetail, onNavigateToPermissions }: OverviewScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLand, setSelectedLand] = useState('');
  const [selectedKooperation, setSelectedKooperation] = useState('');

  // Extract unique countries
  const allCountries = Array.from(new Set(data.map(p => p.land)));
  const availableCountries = ['Deutschland', 'Polen', 'Österreich', 'Tschechien', 'Schweiz', 'Niederlande', 'Belgien', 'Frankreich'];
  const kooperationOptions = ['Keine', 'Geplant', 'Aktiv', 'Abgeschlossen'];

  // Filter data
  const filteredData = data.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.parkName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.universitaetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.stadt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.themen.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.forschungsschwerpunkte.some(f => f.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLand = selectedLand === '' || item.land === selectedLand;
    const matchesKooperation = selectedKooperation === '' || item.bisherigeKooperation === selectedKooperation;

    return matchesSearch && matchesLand && matchesKooperation;
  });

  const handleKooperationChange = (id: string, newValue: string) => {
    console.log(`Kooperation für ${id} auf ${newValue} ändern`);
    alert(`Kooperationsstatus würde auf "${newValue}" geändert (nur mit Read/Write Berechtigung)`);
  };

  const handleLandChange = (id: string, newValue: string) => {
    console.log(`Land für ${id} auf ${newValue} ändern`);
    alert(`Land würde auf "${newValue}" geändert (nur mit Read/Write Berechtigung)`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onNavigateToPermissions={onNavigateToPermissions} />
      
      <div className="max-w-[1800px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-gray-900 mb-2">Lausitz Science Park: Partnerparks und Kooperationsprojekte</h2>
          <p className="text-gray-600 mb-6">Assoziierte Universitäten</p>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[280px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Suche..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>
            
            <div className="relative min-w-[180px]">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={selectedLand}
                onChange={(e) => setSelectedLand(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer"
              >
                <option value="">Alle Länder</option>
                {availableCountries.map(land => (
                  <option key={land} value={land}>{land}</option>
                ))}
              </select>
            </div>

            <div className="relative min-w-[200px]">
              <select
                value={selectedKooperation}
                onChange={(e) => setSelectedKooperation(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer"
              >
                <option value="">Alle Kooperationen</option>
                {kooperationOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 text-sm text-gray-600">
            {filteredData.length} {filteredData.length === 1 ? 'Eintrag' : 'Einträge'} gefunden
          </div>
        </div>

        {/* Combined Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {/* Science Park Columns */}
                  <th colSpan={11} className="px-4 py-3 text-left text-sm text-gray-900 bg-blue-50 border-r-2 border-blue-200">
                    Lausitz Science Park: Partnerparks und Kooperationsprojekte
                  </th>
                  {/* University Columns */}
                  <th colSpan={5} className="px-4 py-3 text-left text-sm text-gray-900 bg-purple-50">
                    Assoziierte Universitäten
                  </th>
                  <th className="px-4 py-3 bg-gray-50"></th>
                </tr>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {/* Science Park Headers */}
                  <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider">Land</th>
                  <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider">Stadt</th>
                  <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider">Gründungsjahr</th>
                  <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider">Bisherige Kooperation</th>
                  <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider">Datum</th>
                  <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider">Themen</th>
                  <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider">Bemerkungen</th>
                  <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider">Ansprechpartner*in</th>
                  <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider">Kontaktdetails</th>
                  <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider border-r-2 border-blue-200">Webpräsenz</th>
                  {/* University Headers */}
                  <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider">Standort</th>
                  <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider">Fakultäten</th>
                  <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider">Forschungsschwerpunkte/Expertise</th>
                  <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider">Ansprechpartner</th>
                  <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider">Website</th>
                  <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    {/* Science Park Data */}
                    <td className="px-3 py-4 text-sm text-gray-900">{item.parkName}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      <select
                        value={item.land}
                        onChange={(e) => handleLandChange(item.id, e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer hover:border-gray-400 transition-colors text-sm"
                      >
                        {availableCountries.map(land => (
                          <option key={land} value={land}>{land}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{item.stadt}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{item.gruendungsjahr}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm">
                      <select
                        value={item.bisherigeKooperation}
                        onChange={(e) => handleKooperationChange(item.id, e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer hover:border-gray-400 transition-colors text-sm"
                      >
                        {kooperationOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(item.datum).toLocaleDateString('de-DE')}
                    </td>
                    <td className="px-3 py-4 text-sm">
                      <div className="flex flex-wrap gap-1 max-w-[160px]">
                        {item.themen.slice(0, 2).map((thema, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800"
                          >
                            {thema}
                          </span>
                        ))}
                        {item.themen.length > 2 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                            +{item.themen.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-600 max-w-[180px]">
                      <div className="truncate" title={item.bemerkungen}>
                        {item.bemerkungen}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-900">{item.parkAnsprechpartner}</td>
                    <td className="px-3 py-4 text-sm text-gray-600 max-w-[200px]">{item.kontaktdetails}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm border-r-2 border-blue-200">
                      <a
                        href={item.webpraesenz}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Link
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    {/* University Data */}
                    <td className="px-3 py-4 text-sm text-gray-900">{item.universitaetName}</td>
                    <td className="px-3 py-4 text-sm text-gray-900">{item.standort}</td>
                    <td className="px-3 py-4 text-sm">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {item.fakultaeten.slice(0, 2).map((fak, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-800"
                          >
                            {fak}
                          </span>
                        ))}
                        {item.fakultaeten.length > 2 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                            +{item.fakultaeten.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {item.forschungsschwerpunkte.slice(0, 2).map((schwerpunkt, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800"
                          >
                            {schwerpunkt}
                          </span>
                        ))}
                        {item.forschungsschwerpunkte.length > 2 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                            +{item.forschungsschwerpunkte.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-900">{item.uniAnsprechpartner}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm">
                      <a
                        href={item.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Link
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => onViewDetail(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}