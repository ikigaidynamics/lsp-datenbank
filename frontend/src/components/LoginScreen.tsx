import { useState } from 'react';
import { toast } from 'sonner';
import lspLogo from 'figma:asset/9d2e39b17304e3c95797c4ba100d35501b94eef9.png';
import type { LoginRequest } from '@/api/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LoginScreenProps = {
  onLogin: (data: LoginRequest) => Promise<void>;
  error: string | null;
};

export function LoginScreen({ onLogin, error }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onLogin({ username, password });
    } catch {
      toast.error('Benutzername oder Passwort falsch.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col items-center mb-8">
            <img src={lspLogo} alt="LSP Logo" className="h-12 mb-4" />
            <h1 className="text-gray-900 text-center">Partnerdatenbank</h1>
            <p className="text-sm text-gray-600 mt-1">Bitte melden Sie sich an</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Benutzername</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Benutzername"
                required
                autoFocus
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Passwort"
                required
                className="mt-1.5"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Anmelden...' : 'Anmelden'}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Demo-Zugänge: admin / sandra / gast
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
