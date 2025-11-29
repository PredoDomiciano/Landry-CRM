import { AppProvider, useApp } from '@/contexts/AppContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoginPage } from '@/components/auth/LoginPage';

const AppContent = () => {
  const { isLoggedIn } = useApp();
  
  if (!isLoggedIn) {
    return <LoginPage />;
  }
  
  return <MainLayout />;
};

const Index = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default Index;
