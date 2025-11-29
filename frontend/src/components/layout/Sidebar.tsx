import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { 
  Home, 
  Users, 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  UserCog,
  Activity,
  Menu,
  X,
  Gem,
  HelpCircle,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'clientes', name: 'Clientes', icon: Users },
  { id: 'oportunidades', name: 'Oportunidades', icon: TrendingUp },
  { id: 'pedidos', name: 'Pedidos', icon: ShoppingBag },
  { id: 'produtos', name: 'Produtos', icon: Package },
  { id: 'funcionarios', name: 'Funcionários', icon: UserCog },
  { id: 'logs', name: 'Log de Atividades', icon: Activity },
  { id: 'faq', name: 'FAQ', icon: HelpCircle },
];

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout, currentUser } = useApp();

  return (
    <div className={cn(
      "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col h-full",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <Gem className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-bold text-sidebar-primary text-lg">Landry</h1>
                <p className="text-xs text-sidebar-foreground/70">Joias Premium</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* User info */}
      {!isCollapsed && currentUser && (
        <div className="px-4 py-3 border-b border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/70">Logado como</p>
          <p className="text-sm font-medium text-sidebar-foreground truncate">{currentUser.email}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "w-full justify-start gap-3 h-10 transition-smooth",
                    isActive 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <Icon className={cn("w-4 h-4", isCollapsed && "w-5 h-5")} />
                  {!isCollapsed && <span className="font-medium">{item.name}</span>}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className={cn(
            "w-full justify-start gap-3 h-10 text-destructive hover:bg-destructive/10 hover:text-destructive",
            isCollapsed && "justify-center px-2"
          )}
        >
          <LogOut className={cn("w-4 h-4", isCollapsed && "w-5 h-5")} />
          {!isCollapsed && <span className="font-medium">Sair</span>}
        </Button>
        {!isCollapsed && (
          <div className="text-xs text-sidebar-foreground/60 text-center">
            <p>CRM Landry Joias</p>
            <p>v1.0.0</p>
          </div>
        )}
      </div>
    </div>
  );
};
