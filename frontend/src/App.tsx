import { useState } from 'react';

import type { Partnership } from '@/api/types';
import { LoginScreen } from '@/components/LoginScreen';
import { OverviewScreen } from '@/components/OverviewScreen';
import { DetailScreen } from '@/components/DetailScreen';
import { PermissionsScreen } from '@/components/PermissionsScreen';
import { useAuth } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/sonner';

type Screen = 'overview' | 'detail' | 'permissions';

export default function App() {
  const auth = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>('overview');
  const [selectedPartnershipId, setSelectedPartnershipId] = useState<number | null>(null);

  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Laden...</p>
      </div>
    );
  }

  if (!auth.user) {
    return (
      <>
        <LoginScreen onLogin={auth.login} error={auth.error} />
        <Toaster />
      </>
    );
  }

  const handleViewDetail = (partnership: Partnership) => {
    setSelectedPartnershipId(partnership.id);
    setCurrentScreen('detail');
  };

  const handleBack = () => {
    setCurrentScreen('overview');
    setSelectedPartnershipId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentScreen === 'overview' && (
        <OverviewScreen
          onViewDetail={handleViewDetail}
          onNavigateToPermissions={() => setCurrentScreen('permissions')}
          auth={auth}
        />
      )}
      {currentScreen === 'detail' && selectedPartnershipId !== null && (
        <DetailScreen
          partnershipId={selectedPartnershipId}
          onBack={handleBack}
          onNavigateToPermissions={() => setCurrentScreen('permissions')}
          auth={auth}
        />
      )}
      {currentScreen === 'permissions' && (
        <PermissionsScreen
          onBack={handleBack}
          onNavigateToOverview={() => setCurrentScreen('overview')}
          auth={auth}
        />
      )}
      <Toaster />
    </div>
  );
}
