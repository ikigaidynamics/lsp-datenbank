import { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import type { AuthUser, ProfileUpdateRequest } from '@/api/types';

interface ProfileDialogProps {
  user: AuthUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ProfileUpdateRequest) => Promise<void>;
}

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  fontSize: '14px',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  outline: 'none',
};

const LABEL_STYLE: React.CSSProperties = {
  display: 'block',
  fontSize: '14px',
  fontWeight: 500,
  color: '#374151',
  marginBottom: '4px',
};

export function ProfileDialog({ user, open, onOpenChange, onSave }: ProfileDialogProps) {
  const [username, setUsername] = useState(user.username);
  const [displayName, setDisplayName] = useState(user.displayName ?? '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!open) return null;

  const handleClose = () => {
    setUsername(user.username);
    setDisplayName(user.displayName ?? '');
    setNewPassword('');
    setConfirmPassword('');
    setCurrentPassword('');
    onOpenChange(false);
  };

  const handleSave = async () => {
    if (!currentPassword.trim()) {
      toast.error('Bitte geben Sie Ihr aktuelles Passwort ein.');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      toast.error('Neues Passwort muss mindestens 6 Zeichen lang sein.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      toast.error('Passwörter stimmen nicht überein.');
      return;
    }

    const hasChanges =
      username !== user.username ||
      displayName !== (user.displayName ?? '') ||
      newPassword.length > 0;

    if (!hasChanges) {
      handleClose();
      return;
    }

    const data: ProfileUpdateRequest = {
      currentPassword,
      newUsername: username !== user.username ? username : undefined,
      newDisplayName: displayName !== (user.displayName ?? '') ? displayName : undefined,
      newPassword: newPassword || undefined,
    };

    setIsSaving(true);
    try {
      await onSave(data);
      toast.success('Profil aktualisiert.');
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Fehler beim Speichern.';
      toast.error(message);
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
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          width: '100%',
          maxWidth: '480px',
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
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>Profil bearbeiten</h3>
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
              Nutzername, Anzeigename oder Passwort ändern
            </p>
          </div>
          <button
            onClick={handleClose}
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
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={LABEL_STYLE}>Nutzername</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={INPUT_STYLE}
            />
          </div>

          <div>
            <label style={LABEL_STYLE}>Anzeigename</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Optional"
              style={INPUT_STYLE}
            />
          </div>

          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
            <label style={LABEL_STYLE}>Neues Passwort</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Leer lassen, um nicht zu ändern"
              style={INPUT_STYLE}
            />
          </div>

          <div>
            <label style={LABEL_STYLE}>Neues Passwort bestätigen</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Passwort wiederholen"
              style={INPUT_STYLE}
            />
          </div>

          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
            <label style={{ ...LABEL_STYLE, color: '#dc2626' }}>Aktuelles Passwort *</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Zur Bestätigung erforderlich"
              style={INPUT_STYLE}
            />
          </div>
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
            onClick={handleClose}
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
            {isSaving ? 'Speichern...' : 'Speichern'}
          </button>
        </div>
      </div>
    </div>
  );
}
