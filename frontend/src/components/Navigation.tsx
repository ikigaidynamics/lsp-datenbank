import { Shield } from 'lucide-react';
import lspLogo from 'figma:asset/9d2e39b17304e3c95797c4ba100d35501b94eef9.png';

type NavigationProps = {
  onNavigateToPermissions?: () => void;
};

export function Navigation({ onNavigateToPermissions }: NavigationProps) {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={lspLogo} alt="LSP Logo" className="h-8" />
            <h1 className="text-gray-900">Lausitz Science Park – Partnerdatenbank</h1>
          </div>
          <div className="flex items-center gap-4">
            {onNavigateToPermissions && (
              <button
                onClick={onNavigateToPermissions}
                className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span className="text-sm">Berechtigungen</span>
              </button>
            )}
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-sm">Eingeloggt als: Sandra (Read/Write)</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}