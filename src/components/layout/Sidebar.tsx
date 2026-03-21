import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Bell, Users, FileText, Video, CreditCard, Receipt, Database, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarItemProps {
  icon: React.ReactElement<{ className?: string }>;
  label: string;
  to: string;
  isActive?: boolean;
  onClick?: () => void;
}

function SidebarItem({ icon, label, to, isActive, onClick }: SidebarItemProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors my-0.5",
        isActive 
          ? "bg-indigo-500/15 text-indigo-400" 
          : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100"
      )}
    >
      {React.cloneElement(icon, {
        className: cn("h-5 w-5", isActive ? "text-indigo-400" : "text-zinc-500")
      })}
      {label}
    </Link>
  );
}

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const path = location.pathname;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex h-[100dvh] w-64 md:w-64 flex-col border-r border-zinc-900 bg-zinc-950 px-4 py-6">
      <div className="flex items-center gap-2 mb-8 px-2 md:flex">
        <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <span className="text-white font-bold text-xl leading-none">R</span>
        </div>
        <span className="text-lg font-bold text-zinc-100 tracking-tight">Retexia</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-1">
        <div>
          <h4 className="mb-2 px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">General</h4>
          <SidebarItem 
            icon={<LayoutDashboard />} 
            label="Dashboard" 
            to="/dashboard"
            isActive={path === '/dashboard'}
            onClick={onClose}
          />
          <SidebarItem 
            icon={<CheckSquare />} 
            label="My Tasks" 
            to="/tasks"
            isActive={path === '/tasks'}
            onClick={onClose}
          />
          <SidebarItem 
            icon={<Bell />} 
            label="Notifications" 
            to="/notifications"
            isActive={path === '/notifications'}
            onClick={onClose}
          />
        </div>

        <div>
          <h4 className="mb-2 px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Workspace</h4>
          <SidebarItem 
            icon={<Users />} 
            label="Clients & CRM" 
            to="/crm"
            isActive={path === '/crm' || path.startsWith('/clients/')}
            onClick={onClose}
          />
          <SidebarItem 
            icon={<FileText />} 
            label="BRD Drafting" 
            to="/brd"
            isActive={path === '/brd' || path.startsWith('/brd/')}
            onClick={onClose}
          />
          <SidebarItem 
            icon={<Video />} 
            label="Meeting Notes" 
            to="/meetings"
            isActive={path === '/meetings'}
            onClick={onClose}
          />
        </div>

        <div>
          <h4 className="mb-2 px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Engineering</h4>
          <SidebarItem 
            icon={<Database />} 
            label="Architecture Queue" 
            to="/arch-queue"
            isActive={path === '/arch-queue' || path.startsWith('/arch-queue/')}
            onClick={onClose}
          />
        </div>

        <div>
          <h4 className="mb-2 px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">My Finance</h4>
          <SidebarItem 
            icon={<CreditCard />} 
            label="Payment History" 
            to="/payments"
            isActive={path === '/payments'}
            onClick={onClose}
          />
          <SidebarItem 
            icon={<Receipt />} 
            label="Invoices" 
            to="/invoices"
            isActive={path === '/invoices'}
            onClick={onClose}
          />
        </div>
      </div>
      
      <div className="mt-auto pt-4 border-t border-zinc-900 flex-shrink-0">
        <div className="flex items-center justify-between px-3 py-2 group cursor-pointer hover:bg-zinc-900 rounded-md transition-colors">
          <div className="flex items-center gap-3">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
              alt="User avatar" 
              className="h-9 w-9 rounded-full bg-zinc-800 border border-zinc-700"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">BA Agent</span>
              <span className="text-xs text-zinc-500">Workspace Member</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
