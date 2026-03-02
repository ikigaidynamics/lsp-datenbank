import { useEffect, useState } from 'react';
import { Search, Filter, ExternalLink, Eye, Pencil, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Navigation } from './Navigation';
import { ExpandableTags } from './ui/ExpandableTags';
import { EditPartnershipDialog } from './overview/EditPartnershipDialog';
import { CreatePartnershipDialog } from './overview/CreatePartnershipDialog';
import { ColumnToggle, PARK_KEYS, UNI_KEYS } from './overview/ColumnToggle';
import type { Partnership, KooperationStatus } from '@/api/types';
import type { useAuth } from '@/hooks/useAuth';
import { usePartnerships } from '@/hooks/usePartnerships';
import { useFilters } from '@/hooks/useFilters';
import { COUNTRIES, KOOPERATION_STATUS } from '@/lib/constants';

type OverviewScreenProps = {
  onViewDetail: (partnership: Partnership) => void;
  onNavigateToPermissions: () => void;
  auth: ReturnType<typeof useAuth>;
};

export function OverviewScreen({ onViewDetail, onNavigateToPermissions, auth }: OverviewScreenProps) {
  const { partnerships, isLoading, error, fetchAll, updateStatus, update, create } = usePartnerships();
  const filters = useFilters();

  useEffect(() => {
    fetchAll({
      search: filters.debouncedSearch || undefined,
      land: filters.land || undefined,
      kooperation: filters.kooperation || undefined,
    });
  }, [fetchAll, filters.debouncedSearch, filters.land, filters.kooperation]);

  const handleKooperationChange = async (id: number, newValue: string) => {
    try {
      await updateStatus(id, newValue as KooperationStatus);
      toast.success('Kooperationsstatus aktualisiert.');
    } catch {
      toast.error('Fehler beim Aktualisieren des Status.');
    }
  };

  const handleLandChange = async (id: number, newValue: string) => {
    try {
      await update(id, { land: newValue });
      toast.success('Land aktualisiert.');
    } catch {
      toast.error('Fehler beim Aktualisieren.');
    }
  };

  const canEdit = auth.hasRole('readwrite');
  const [editingPartnership, setEditingPartnership] = useState<Partnership | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Column visibility
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const toggleColumn = (key: string) => {
    setHiddenColumns(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };
  const v = (key: string) => !hiddenColumns.has(key);
  const parkColSpan = PARK_KEYS.filter(k => v(k)).length;
  const uniColSpan = UNI_KEYS.filter(k => v(k)).length;
  const lastVisiblePark = [...PARK_KEYS].reverse().find(k => v(k));
  const borderStyle = { borderRight: '2px solid #bfdbfe' };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={auth.user!} onNavigateToPermissions={onNavigateToPermissions} onLogout={auth.logout} />

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
                value={filters.search}
                onChange={(e) => filters.setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
            </div>

            <div className="relative min-w-[180px]">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select
                value={filters.land}
                onChange={(e) => filters.setLand(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer"
              >
                <option value="">Alle Länder</option>
                {COUNTRIES.map(land => (
                  <option key={land} value={land}>{land}</option>
                ))}
              </select>
            </div>

            <div className="relative min-w-[200px]">
              <select
                value={filters.kooperation}
                onChange={(e) => filters.setKooperation(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer"
              >
                <option value="">Alle Kooperationen</option>
                {KOOPERATION_STATUS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {isLoading ? 'Laden...' : `${partnerships.length} ${partnerships.length === 1 ? 'Eintrag' : 'Einträge'} gefunden`}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ColumnToggle hiddenColumns={hiddenColumns} onToggle={toggleColumn} />
              {canEdit && (
                <button
                  onClick={() => setShowCreateDialog(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: 500,
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                >
                  <Plus style={{ width: '16px', height: '16px' }} />
                  Partner hinzufügen
                </button>
              )}
            </div>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        {/* Combined Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {parkColSpan > 0 && (
                    <th colSpan={parkColSpan} className="px-4 py-3 text-left text-sm text-gray-900 bg-blue-50" style={uniColSpan > 0 ? borderStyle : undefined}>
                      Lausitz Science Park: Partnerparks und Kooperationsprojekte
                    </th>
                  )}
                  {uniColSpan > 0 && (
                    <th colSpan={uniColSpan} className="px-4 py-3 text-left text-sm text-gray-900 bg-purple-50">
                      Assoziierte Universitäten
                    </th>
                  )}
                  <th className="px-4 py-3 bg-gray-50"></th>
                </tr>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {v('parkName') && <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider" style={lastVisiblePark === 'parkName' ? borderStyle : undefined}>Name</th>}
                  {v('land') && <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider" style={lastVisiblePark === 'land' ? borderStyle : undefined}>Land</th>}
                  {v('stadt') && <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider" style={lastVisiblePark === 'stadt' ? borderStyle : undefined}>Stadt</th>}
                  {v('gruendungsjahr') && <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider" style={lastVisiblePark === 'gruendungsjahr' ? borderStyle : undefined}>Gründungsjahr</th>}
                  {v('bisherigeKooperation') && <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider" style={lastVisiblePark === 'bisherigeKooperation' ? borderStyle : undefined}>Bisherige Kooperation</th>}
                  {v('datum') && <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider" style={lastVisiblePark === 'datum' ? borderStyle : undefined}>Datum</th>}
                  {v('themen') && <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider" style={lastVisiblePark === 'themen' ? borderStyle : undefined}>Themen</th>}
                  {v('bemerkungen') && <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider" style={lastVisiblePark === 'bemerkungen' ? borderStyle : undefined}>Bemerkungen</th>}
                  {v('parkAnsprechpartner') && <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider" style={lastVisiblePark === 'parkAnsprechpartner' ? borderStyle : undefined}>Ansprechpartner*in</th>}
                  {v('kontaktdetails') && <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider" style={lastVisiblePark === 'kontaktdetails' ? borderStyle : undefined}>Kontaktdetails</th>}
                  {v('webpraesenz') && <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider" style={lastVisiblePark === 'webpraesenz' ? borderStyle : undefined}>Webpräsenz</th>}
                  {v('universitaetName') && <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider">Name</th>}
                  {v('standort') && <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider">Standort</th>}
                  {v('forschungsschwerpunkte') && <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider">Forschungsschwerpunkte/Expertise</th>}
                  {v('uniAnsprechpartner') && <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider">Ansprechpartner</th>}
                  <th className="px-3 py-3.5 text-left text-xs text-gray-600 uppercase tracking-wider">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {partnerships.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    {v('parkName') && <td className="px-3 py-4 text-sm text-gray-900" style={lastVisiblePark === 'parkName' ? borderStyle : undefined}>{item.parkName}</td>}
                    {v('land') && (
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900" style={{ minWidth: '140px', ...(lastVisiblePark === 'land' ? borderStyle : {}) }}>
                        {canEdit ? (
                          <select
                            value={item.land}
                            onChange={(e) => handleLandChange(item.id, e.target.value)}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer hover:border-gray-400 transition-colors text-sm"
                            style={{ minWidth: '120px' }}
                          >
                            {COUNTRIES.map(land => (
                              <option key={land} value={land}>{land}</option>
                            ))}
                          </select>
                        ) : item.land}
                      </td>
                    )}
                    {v('stadt') && <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900" style={lastVisiblePark === 'stadt' ? borderStyle : undefined}>{item.stadt}</td>}
                    {v('gruendungsjahr') && <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900" style={lastVisiblePark === 'gruendungsjahr' ? borderStyle : undefined}>{item.gruendungsjahr}</td>}
                    {v('bisherigeKooperation') && (
                      <td className="px-3 py-4 whitespace-nowrap text-sm" style={lastVisiblePark === 'bisherigeKooperation' ? borderStyle : undefined}>
                        {canEdit ? (
                          <select
                            value={item.bisherigeKooperation ?? ''}
                            onChange={(e) => handleKooperationChange(item.id, e.target.value)}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer hover:border-gray-400 transition-colors text-sm"
                          >
                            {KOOPERATION_STATUS.map(option => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        ) : (item.bisherigeKooperation ?? '—')}
                      </td>
                    )}
                    {v('datum') && (
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900" style={lastVisiblePark === 'datum' ? borderStyle : undefined}>
                        {item.datum ? new Date(item.datum).toLocaleDateString('de-DE') : '—'}
                      </td>
                    )}
                    {v('themen') && (
                      <td className="px-3 py-4 text-sm" style={lastVisiblePark === 'themen' ? borderStyle : undefined}>
                        <ExpandableTags items={item.themen} colorClass="bg-blue-100 text-blue-800" />
                      </td>
                    )}
                    {v('bemerkungen') && (
                      <td className="px-3 py-4 text-sm text-gray-600 max-w-[180px]" style={lastVisiblePark === 'bemerkungen' ? borderStyle : undefined}>
                        <div className="truncate" title={item.bemerkungen ?? ''}>
                          {item.bemerkungen}
                        </div>
                      </td>
                    )}
                    {v('parkAnsprechpartner') && <td className="px-3 py-4 text-sm text-gray-900" style={lastVisiblePark === 'parkAnsprechpartner' ? borderStyle : undefined}>{item.parkAnsprechpartner}</td>}
                    {v('kontaktdetails') && <td className="px-3 py-4 text-sm text-gray-600 max-w-[200px]" style={lastVisiblePark === 'kontaktdetails' ? borderStyle : undefined}>{item.kontaktdetails}</td>}
                    {v('webpraesenz') && (
                      <td className="px-3 py-4 whitespace-nowrap text-sm" style={lastVisiblePark === 'webpraesenz' ? borderStyle : undefined}>
                        {item.webpraesenz && (
                          <a href={item.webpraesenz} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline">
                            Link <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </td>
                    )}
                    {v('universitaetName') && <td className="px-3 py-4 text-sm text-gray-900">{item.universitaetName}</td>}
                    {v('standort') && <td className="px-3 py-4 text-sm text-gray-900">{item.standort}</td>}
                    {v('forschungsschwerpunkte') && (
                      <td className="px-3 py-4 text-sm">
                        <ExpandableTags items={item.forschungsschwerpunkte} colorClass="bg-green-100 text-green-800" />
                      </td>
                    )}
                    {v('uniAnsprechpartner') && <td className="px-3 py-4 text-sm text-gray-900">{item.uniAnsprechpartner}</td>}
                    <td className="px-3 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-1">
                        {canEdit && (
                          <button
                            onClick={() => setEditingPartnership(item)}
                            className="inline-flex items-center gap-1 px-2 py-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Bearbeiten"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onViewDetail(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {editingPartnership && (
          <EditPartnershipDialog
            partnership={editingPartnership}
            open={!!editingPartnership}
            onOpenChange={(open) => { if (!open) setEditingPartnership(null); }}
            onSave={update}
          />
        )}

        <CreatePartnershipDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onCreate={create}
        />
      </div>
    </div>
  );
}
