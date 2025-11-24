import React from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Logo } from './layout/Logo';
import { 
  BarChart3,
  Users,
  FileText,
  CreditCard,
  LogOut,
  LucideIcon,
  Bot,
  Building,
  Activity,
  Settings,
  User,
  ClipboardList,
  ChevronDown,
  ChevronLeft,
  Menu,
  X
} from 'lucide-react';
import type { UserRole } from '../App';
import { getPageTitle } from './layout/PageTitles';
import { AIChatWidget } from './AIChatWidget';
import { Footer } from './shared/Footer';
import { ScrollArea } from './ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  userRole: UserRole;
  userName: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onGoToLanding?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  submenu?: MenuItem[];
}

export function Layout({ 
  children, 
  currentPage, 
  userRole, 
  userName, 
  onNavigate, 
  onLogout,
  onGoToLanding
}: LayoutProps) {
  const [expandedMenus, setExpandedMenus] = React.useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleLogoClick = () => {
    if (onGoToLanding) {
      onGoToLanding();
    } else {
      if (userRole === 'beneficiary') {
        onNavigate('enhanced-survey');
      } else {
        onNavigate('dashboard');
      }
    }
  };

  const handleAvatarClick = () => {
    if (userRole === 'org_manager') {
      onNavigate('profile');
    }
  };

  const getMenuItems = () => {
    const baseItems: MenuItem[] = [];
    
    if (userRole === 'super_admin') {
      baseItems.push(
        { id: 'dashboard', label: getPageTitle('dashboard', userRole), icon: BarChart3 },
        { id: 'organizations', label: getPageTitle('organizations', userRole), icon: Building },
        { id: 'user-management', label: getPageTitle('user-management', userRole), icon: Users },
        { id: 'subscription', label: getPageTitle('subscription', userRole), icon: CreditCard },
        { id: 'system-settings', label: getPageTitle('system-settings', userRole), icon: Settings },
        { id: 'activity-logs', label: getPageTitle('activity-logs', userRole), icon: Activity }
      );
    }
    else if (userRole === 'admin') {
      baseItems.push(
        { id: 'dashboard', label: getPageTitle('dashboard', userRole), icon: BarChart3 },
        { id: 'surveys', label: getPageTitle('surveys', userRole), icon: FileText },
        { id: 'global-survey-settings', label: getPageTitle('global-survey-settings', userRole), icon: Settings },
        { id: 'beneficiaries', label: getPageTitle('beneficiaries', userRole), icon: Building },
        { id: 'organization-requests', label: getPageTitle('organization-requests', userRole), icon: ClipboardList },
        { id: 'user-management', label: getPageTitle('user-management', userRole), icon: Users },
        { id: 'admin-billing', label: getPageTitle('admin-billing', userRole), icon: CreditCard },
        { id: 'admin-settings', label: getPageTitle('admin-settings', userRole), icon: Settings }
      );
    }
    else if (userRole === 'org_manager') {
      baseItems.push(
        { id: 'dashboard', label: getPageTitle('dashboard', userRole), icon: BarChart3 },
        { id: 'surveys', label: getPageTitle('surveys', userRole), icon: FileText },
        { id: 'beneficiaries', label: getPageTitle('beneficiaries', userRole), icon: Users },
        { id: 'analysis', label: getPageTitle('analysis', userRole), icon: Bot }
      );
    }
    
    return baseItems;
  };

  React.useEffect(() => {
    const menuItems = getMenuItems();
    menuItems.forEach(item => {
      if (item.submenu) {
        const hasActiveSubmenu = item.submenu.some(subItem => subItem.id === currentPage);
        if (hasActiveSubmenu && !expandedMenus.includes(item.id)) {
          setExpandedMenus(prev => [...prev, item.id]);
        }
      }
    });
  }, [currentPage]);

  if (currentPage === 'login' || currentPage === 'signup') {
    return <>{children}</>;
  }

  // Simple layout for beneficiaries
  if (userRole === 'beneficiary') {
    return (
      <div className="min-h-screen bg-[#18325A]" dir="rtl">
        <header className="bg-[#18325A]/95 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
          <div className="px-6 h-16 flex items-center justify-center">
            <Logo 
              onClick={handleLogoClick}
              size="md"
              showText={true}
              variant="light"
            />
          </div>
        </header>

        <main className="w-full min-h-[calc(100vh-9rem)]">
          {children}
        </main>

        <Footer />
      </div>
    );
  }

  // Clean admin layout
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
        <div className="h-full px-4 sm:px-6 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 p-0">
              <div className="h-full flex flex-col">
                <ScrollArea className="flex-1">
                  <nav className="p-4 space-y-1">
                    {getMenuItems().map((item) => (
                      <div key={item.id}>
                        <Button
                          variant="ghost"
                          className={`w-full flex items-center gap-3 h-10 rounded-lg transition-all ${
                            currentPage === item.id || (item.submenu && item.submenu.some(sub => sub.id === currentPage))
                              ? 'bg-[#183259] text-white hover:bg-[#183259]/90 hover:text-white' 
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                          onClick={() => {
                            onNavigate(item.id);
                            setMobileMenuOpen(false);
                            if (item.submenu) {
                              toggleMenu(item.id);
                            }
                          }}
                        >
                          {item.submenu && (
                            <ChevronDown 
                              className={`h-4 w-4 shrink-0 transition-transform ${
                                expandedMenus.includes(item.id) ? 'rotate-180' : ''
                              }`}
                            />
                          )}
                          <span className="flex-1 text-right text-sm">{item.label}</span>
                          <item.icon className="h-4 w-4 shrink-0" />
                        </Button>

                        {item.submenu && expandedMenus.includes(item.id) && (
                          <div className="mr-7 mt-1 space-y-1">
                            {item.submenu.map((subItem) => (
                              <Button
                                key={subItem.id}
                                variant="ghost"
                                className={`w-full justify-start gap-3 h-9 rounded-lg text-sm transition-all ${
                                  currentPage === subItem.id 
                                    ? 'bg-gray-100 text-gray-900' 
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                                onClick={() => {
                                  onNavigate(subItem.id);
                                  setMobileMenuOpen(false);
                                }}
                              >
                                <ChevronLeft className="h-3 w-3 shrink-0" />
                                <subItem.icon className="h-3 w-3 shrink-0" />
                                <span className="text-right">{subItem.label}</span>
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </nav>
                </ScrollArea>

                <div className="p-4 border-t border-gray-200 bg-white">
                  <Button
                    variant="ghost"
                    className="w-full flex items-center gap-3 h-10 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all"
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <span className="flex-1 text-right text-sm">تسجيل الخروج</span>
                    <LogOut className="h-4 w-4 shrink-0" />
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Logo 
            onClick={handleLogoClick}
            size="sm"
            showText={true}
            variant="dark"
          />
          
          <div 
            className={`flex items-center gap-3 ${
              userRole === 'org_manager' ? 'cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors' : ''
            }`}
            onClick={handleAvatarClick}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-500">
                {userRole === 'super_admin' && 'مدير النظام'}
                {userRole === 'admin' && 'مدير المنصة'}
                {userRole === 'org_manager' && 'مدير منظمة'}
              </p>
            </div>
            <Avatar className="h-9 w-9 ring-2 ring-gray-100">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-to-br from-[#183259] to-[#2a4a7a] text-white text-sm">
                {userName.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Minimal Sidebar - Desktop Only */}
      <aside className="hidden lg:fixed lg:block right-0 top-16 bottom-0 w-64 bg-white border-l border-gray-200 z-40">
        <div className="h-full flex flex-col">
          <ScrollArea className="flex-1">
            <nav className="p-4 space-y-1">
              {getMenuItems().map((item) => (
                <div key={item.id}>
                  <Button
                    variant="ghost"
                    className={`w-full flex items-center gap-3 h-10 rounded-lg transition-all ${
                      currentPage === item.id || (item.submenu && item.submenu.some(sub => sub.id === currentPage))
                        ? 'bg-[#183259] text-white hover:bg-[#183259]/90 hover:text-white' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    onClick={() => {
                      onNavigate(item.id);
                      if (item.submenu) {
                        toggleMenu(item.id);
                      }
                    }}
                  >
                    {item.submenu && (
                      <ChevronDown 
                        className={`h-4 w-4 shrink-0 transition-transform ${
                          expandedMenus.includes(item.id) ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                    <span className="flex-1 text-right text-sm">{item.label}</span>
                    <item.icon className="h-4 w-4 shrink-0" />
                  </Button>

                  {item.submenu && expandedMenus.includes(item.id) && (
                    <div className="mr-7 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Button
                          key={subItem.id}
                          variant="ghost"
                          className={`w-full justify-start gap-3 h-9 rounded-lg text-sm transition-all ${
                            currentPage === subItem.id 
                              ? 'bg-gray-100 text-gray-900' 
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                          onClick={() => onNavigate(subItem.id)}
                        >
                          <ChevronLeft className="h-3 w-3 shrink-0" />
                          <subItem.icon className="h-3 w-3 shrink-0" />
                          <span className="text-right">{subItem.label}</span>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </ScrollArea>

          <div className="p-4 border-t border-gray-200 bg-white">
            <Button
              variant="ghost"
              className="w-full flex items-center gap-3 h-10 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all"
              onClick={onLogout}
            >
              <span className="flex-1 text-right text-sm">تسجيل الخروج</span>
              <LogOut className="h-4 w-4 shrink-0" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:mr-64 mt-16 min-h-[calc(100vh-4rem)]">
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>

      {/* Footer */}
      <div className="mr-64">
        <Footer />
      </div>

      {/* AI Chat Widget */}
      <AIChatWidget userRole={userRole} userName={userName} />
    </div>
  );
}
