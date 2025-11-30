import { AppProvider, useApp } from '@/contexts/AppContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Login } from '@/components/auth/LoginPage';

const AppContent = () => {
  const { isLoggedIn } = useApp();
  
  if (!isLoggedIn) {
    return <Login />;
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
