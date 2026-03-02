import type { EditFormData } from '@/hooks/useEditForm';
import { TagInput } from '@/components/ui/TagInput';
import { COUNTRIES, KOOPERATION_STATUS } from '@/lib/constants';

interface EditPartnershipFormProps {
  formData: EditFormData;
  onFieldChange: <K extends keyof EditFormData>(key: K, value: EditFormData[K]) => void;
}

export function EditPartnershipForm({ formData, onFieldChange }: EditPartnershipFormProps) {
  return (
    <div className="space-y-6">
      {/* Science Park Section */}
      <div>
        <h4 className="text-sm font-semibold text-blue-800 bg-blue-50 px-3 py-2 rounded-lg mb-4">
          Science Park
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name *</label>
            <input
              type="text"
              value={formData.parkName}
              onChange={(e) => onFieldChange('parkName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Land *</label>
            <select
              value={formData.land}
              onChange={(e) => onFieldChange('land', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
            >
              {COUNTRIES.map(land => (
                <option key={land} value={land}>{land}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Stadt *</label>
            <input
              type="text"
              value={formData.stadt}
              onChange={(e) => onFieldChange('stadt', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Gründungsjahr</label>
            <input
              type="number"
              value={formData.gruendungsjahr}
              onChange={(e) => onFieldChange('gruendungsjahr', e.target.value)}
              placeholder="z.B. 2005"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Bisherige Kooperation</label>
            <select
              value={formData.bisherigeKooperation}
              onChange={(e) => onFieldChange('bisherigeKooperation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
            >
              {KOOPERATION_STATUS.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Datum</label>
            <input
              type="date"
              value={formData.datum}
              onChange={(e) => onFieldChange('datum', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Themen</label>
            <TagInput
              value={formData.themen}
              onChange={(tags) => onFieldChange('themen', tags)}
              placeholder="Thema eingeben + Enter"
              colorClass="bg-blue-100 text-blue-800"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Bemerkungen</label>
            <textarea
              value={formData.bemerkungen}
              onChange={(e) => onFieldChange('bemerkungen', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-vertical"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Ansprechpartner*in</label>
            <input
              type="text"
              value={formData.parkAnsprechpartner}
              onChange={(e) => onFieldChange('parkAnsprechpartner', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Kontaktdetails</label>
            <input
              type="text"
              value={formData.kontaktdetails}
              onChange={(e) => onFieldChange('kontaktdetails', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Webpräsenz</label>
            <input
              type="url"
              value={formData.webpraesenz}
              onChange={(e) => onFieldChange('webpraesenz', e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      {/* University Section */}
      <div>
        <h4 className="text-sm font-semibold text-purple-800 bg-purple-50 px-3 py-2 rounded-lg mb-4">
          Assoziierte Universität
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name *</label>
            <input
              type="text"
              value={formData.universitaetName}
              onChange={(e) => onFieldChange('universitaetName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Standort</label>
            <input
              type="text"
              value={formData.standort}
              onChange={(e) => onFieldChange('standort', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Forschungsschwerpunkte</label>
            <TagInput
              value={formData.forschungsschwerpunkte}
              onChange={(tags) => onFieldChange('forschungsschwerpunkte', tags)}
              placeholder="Schwerpunkt eingeben + Enter"
              colorClass="bg-green-100 text-green-800"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Ansprechpartner</label>
            <input
              type="text"
              value={formData.uniAnsprechpartner}
              onChange={(e) => onFieldChange('uniAnsprechpartner', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Website</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => onFieldChange('website', e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
