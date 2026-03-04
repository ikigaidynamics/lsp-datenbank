import { useState } from 'react';
import { LogOut, Shield, UserCog } from 'lucide-react';
import lspLogo from 'figma:asset/9d2e39b17304e3c95797c4ba100d35501b94eef9.png';
import type { AuthUser, ProfileUpdateRequest } from '@/api/types';
import { ProfileDialog } from './ProfileDialog';

const ROLE_LABELS: Record<string, string> = {
  readonly: 'Read-only',
  readwrite: 'Read/Write',
  admin: 'Admin',
};

type NavigationProps = {
  user: AuthUser;
  onNavigateToPermissions?: () => void;
  onLogout?: () => void;
  onUpdateProfile?: (data: ProfileUpdateRequest) => Promise<void>;
};

export function Navigation({ user, onNavigateToPermissions, onLogout, onUpdateProfile }: NavigationProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div style={{ padding: '12px 24px' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={lspLogo} alt="LSP Logo" style={{ height: '56px' }} />
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
              <button
                onClick={() => setProfileOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                title="Profil bearbeiten"
                style={{ border: 'none' }}
              >
                <UserCog className="w-4 h-4" />
                <span className="text-sm">
                  {user.displayName ?? user.username} ({ROLE_LABELS[user.role] ?? user.role})
                </span>
              </button>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Abmelden</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {onUpdateProfile && (
        <ProfileDialog
          user={user}
          open={profileOpen}
          onOpenChange={setProfileOpen}
          onSave={onUpdateProfile}
        />
      )}
    </>
  );
}
