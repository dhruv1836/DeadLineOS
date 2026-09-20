import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { Bell, Menu, ArrowLeft, Home, ChevronRight } from 'lucide-react';
import Sidebar from './Sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export default function AppLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentTitle = pathSegments[0] 
    ? pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1) 
    : 'Dashboard';

  return (
    <div className="flex h-screen w-full bg-slate-50/80 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        {/* Global Navigation Header */}
        <header className="h-16 bg-white/95 backdrop-blur border-b border-slate-200/90 flex items-center justify-between px-4 sm:px-6 shrink-0 z-10 shadow-xs">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5 text-slate-600" />
            </Button>

            {/* Smart Back Button */}
            {location.pathname !== '/dashboard' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
                className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50 rounded-xl transition-all shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </Button>
            )}

            {/* Interactive Breadcrumb Bar */}
            <nav className="flex items-center gap-1 text-xs text-slate-500 font-medium">
              <Link to="/dashboard" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                <Home className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Workspace</span>
              </Link>
              {pathSegments.length > 0 && pathSegments[0] !== 'dashboard' && (
                <>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                    {currentTitle}
                  </span>
                </>
              )}
            </nav>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-indigo-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </Button>
            <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-slate-700 hidden sm:block max-w-[140px] truncate">
                {user?.displayName || user?.email || 'Student'}
              </span>
              <Avatar 
                className="w-8 h-8 cursor-pointer ring-2 ring-indigo-100 hover:ring-indigo-300 transition-all" 
                onClick={() => signOut()}
                title="Click to Sign Out"
              >
                <AvatarFallback className="bg-indigo-600 text-white text-xs font-bold">
                  {user?.email?.charAt(0).toUpperCase() || 'S'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          <div className="mx-auto max-w-7xl h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}