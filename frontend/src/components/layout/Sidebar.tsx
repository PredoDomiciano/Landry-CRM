import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useNavigate, useLocation } from 'react-router-dom'; // Importante
import { 
  Home, Users, TrendingUp, ShoppingBag, 
  Package, UserCog, Activity, Menu, 
  X, Gem, HelpCircle, LogOut 
} from 'lucide-react';

const navigation = [
  { id: '/dashboard', name: 'Dashboard', icon: Home },
  { id: '/clientes', name: 'Clientes', icon: Users },
  { id: '/oportunidades', name: 'Oportunidades', icon: TrendingUp },
  { id: '/pedidos', name: 'Pedidos', icon: ShoppingBag },
  { id: '/produtos', name: 'Produtos', icon: Package },
  { id: '/funcionarios', name: 'Funcionários', icon: UserCog },
  { id: '/logs', name: 'Log de Atividades', icon: Activity },
  { id: '/faq', name: 'FAQ', icon: HelpCircle },
];

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useApp();
  
  const navigate = useNavigate(); // Hook para mudar de página
  const location = useLocation(); // Hook para saber onde estamos

  return (
    <div className={cn(
      "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col h-full shadow-xl z-20",
      isCollapsed ? "w-[80px]" : "w-[280px]"
    )}>
      {/* Header */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-sidebar-border/50 bg-gradient-to-r from-sidebar to-sidebar-accent/5">
        {!isCollapsed && (
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="h-10 w-10 bg-gradient-to-tr from-accent-gold to-yellow-600 rounded-lg flex items-center justify-center shadow-lg shadow-accent-gold/20">
              <Gem className="text-white h-6 w-6" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-sidebar-foreground tracking-tight">Landry Joias</h1>
              <p className="text-[10px] text-accent-gold font-medium tracking-widest uppercase">Premium CRM</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="text-sidebar-foreground/70 hover:text-accent-gold hover:bg-sidebar-accent transition-colors"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            // Verifica se a URL atual contém o ID do item
            const isActive = location.pathname.includes(item.id); 

            return (
              <li key={item.id}>
                <Button
                  variant="ghost"
                  onClick={() => navigate(item.id)} // Muda a URL
                  className={cn(
                    "w-full justify-start gap-3 h-12 transition-all duration-300 relative overflow-hidden group",
                    isActive 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md font-medium" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:pl-6",
                    isCollapsed && "justify-center px-2 hover:pl-2"
                  )}
                >
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-gold" />}
                  <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/70 group-hover:text-accent-gold")} />
                  {!isCollapsed && <span className="text-sm">{item.name}</span>}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border bg-sidebar-background/50">
        <Button
          variant="ghost"
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className={cn(
            "w-full justify-start gap-3 h-12 text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-colors group",
            isCollapsed && "justify-center px-2"
          )}
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          {!isCollapsed && <span className="font-medium">Sair do Sistema</span>}
        </Button>
      </div>
    </div>
  );
};