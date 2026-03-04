import { Eye, Edit3, ShieldCheck, ArrowLeft, Check, X } from 'lucide-react';
import { Navigation } from './Navigation';
import type { useAuth } from '@/hooks/useAuth';

type PermissionsScreenProps = {
  onBack: () => void;
  onNavigateToOverview: () => void;
  auth: ReturnType<typeof useAuth>;
};

export function PermissionsScreen({ onBack, onNavigateToOverview, auth }: PermissionsScreenProps) {
  const roles = [
    {
      id: 'readonly',
      title: 'Read-only',
      icon: Eye,
      color: 'blue',
      description: 'Nur Lesezugriff auf alle Daten',
      permissions: [
        { text: 'Kann Daten ansehen', allowed: true },
        { text: 'Kann Daten exportieren', allowed: true },
        { text: 'Kann nicht bearbeiten', allowed: false },
        { text: 'Kann nicht löschen', allowed: false },
      ],
    },
    {
      id: 'readwrite',
      title: 'Read/Write',
      icon: Edit3,
      color: 'green',
      description: 'Lese- und Schreibzugriff',
      permissions: [
        { text: 'Kann Daten ansehen', allowed: true },
        { text: 'Kann Einträge erstellen', allowed: true },
        { text: 'Kann Einträge bearbeiten', allowed: true },
        { text: 'Kann nicht löschen', allowed: false },
      ],
    },
    {
      id: 'admin',
      title: 'Read/Write/Delete (Admin)',
      icon: ShieldCheck,
      color: 'purple',
      description: 'Volle Administratorrechte',
      permissions: [
        { text: 'Volle Rechte inkl. Löschen', allowed: true },
        { text: 'Kann Nutzerrollen verwalten', allowed: true },
        { text: 'Kann Systemeinstellungen ändern', allowed: true },
        { text: 'Kann Audit-Logs einsehen', allowed: true },
      ],
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        iconBg: 'bg-blue-100',
        iconText: 'text-blue-600',
        border: 'border-blue-200',
        accent: 'bg-blue-600',
      },
      green: {
        bg: 'bg-green-50',
        iconBg: 'bg-green-100',
        iconText: 'text-green-600',
        border: 'border-green-200',
        accent: 'bg-green-600',
      },
      purple: {
        bg: 'bg-purple-50',
        iconBg: 'bg-purple-100',
        iconText: 'text-purple-600',
        border: 'border-purple-200',
        accent: 'bg-purple-600',
      },
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const currentRole = auth.user?.role;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={auth.user!} onLogout={auth.logout} onUpdateProfile={auth.updateProfile} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Zurück</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-gray-900 mb-2">Rollen & Berechtigungen</h2>
          <p className="text-gray-600">
            Übersicht der drei Zugriffslevel im Lausitz Science Park Partnerdatenbank-System
          </p>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            const colors = getColorClasses(role.color);
            const isCurrentRole = role.id === currentRole;

            return (
              <div
                key={role.id}
                className={`bg-white rounded-xl shadow-sm border-2 ${colors.border} overflow-hidden hover:shadow-md transition-shadow`}
              >
                {/* Card header with accent */}
                <div className={`${colors.bg} px-6 pt-6 pb-4 border-b ${colors.border}`}>
                  <div className={`inline-flex items-center justify-center w-14 h-14 ${colors.iconBg} rounded-xl mb-4`}>
                    <Icon className={`w-7 h-7 ${colors.iconText}`} />
                  </div>
                  <h3 className="text-gray-900 mb-2">{role.title}</h3>
                  <p className="text-sm text-gray-600">{role.description}</p>
                </div>

                {/* Card content */}
                <div className="px-6 py-5">
                  <ul className="space-y-3">
                    {role.permissions.map((permission, index) => (
                      <li key={index} className="flex items-start gap-2.5">
                        {permission.allowed ? (
                          <div className={`flex-shrink-0 w-5 h-5 ${colors.accent} rounded-full flex items-center justify-center mt-0.5`}>
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center mt-0.5">
                            <X className="w-3 h-3 text-gray-500" />
                          </div>
                        )}
                        <span className={`text-sm ${permission.allowed ? 'text-gray-900' : 'text-gray-500'}`}>
                          {permission.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card footer – current role indicator */}
                {isCurrentRole && (
                  <div className={`${colors.bg} px-6 py-3 border-t ${colors.border}`}>
                    <div className="flex items-center gap-2 text-sm">
                      <div className={`w-2 h-2 ${colors.accent} rounded-full`}></div>
                      <span className={colors.iconText}>Ihre aktuelle Rolle</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div>
              <h4 className="text-gray-900 mb-2">Rollenverwaltung</h4>
              <p className="text-sm text-gray-700 mb-3">
                Benutzerrollen können nur von Administratoren zugewiesen und geändert werden.
                Wenn Sie eine Änderung Ihrer Berechtigungen benötigen, wenden Sie sich bitte an den Systemadministrator.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Aktueller Administrator:</strong> admin@lausitz-sciencepark.de
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
