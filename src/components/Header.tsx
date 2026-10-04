import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Bell, 
  FileText, 
  BarChart3, 
  Truck, 
  Lock, 
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { NotificationItem } from '../types';

interface HeaderProps {
  activeView: 'public' | 'executive';
  setActiveView: (view: 'public' | 'executive') => void;
  activeModuleTab: 'forms' | 'issuances' | 'logistics';
  setActiveModuleTab: (tab: 'forms' | 'issuances' | 'logistics') => void;
  pendingRequestsCount: number;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenTokenVerifier: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  activeModuleTab,
  setActiveModuleTab,
  pendingRequestsCount,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenTokenVerifier,
}) => {
  return (
    <header className="bg-slate-900 text-white shadow-md border-b border-slate-800">
      {/* Top Government Strip */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="font-semibold text-amber-400 tracking-wider">REPUBLIC OF THE PHILIPPINES</span>
            <span className="text-slate-600">|</span>
            <span>Department of Social Welfare and Development</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400 hidden sm:inline">Regionwide Records &amp; Archives Portal</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              NAP Compliance Active (CY 2026)
            </span>
            <span className="text-slate-600 hidden md:inline">|</span>
            <button 
              onClick={onOpenTokenVerifier}
              className="text-slate-300 hover:text-amber-300 flex items-center gap-1 text-xs cursor-pointer transition-colors"
              title="Verify a time-sensitive access token"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Token Verification Terminal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo & Portal Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-blue-900 border border-blue-700/60 flex items-center justify-center text-amber-400 shadow-inner flex-shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  DSWD Records &amp; Management Portal
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider bg-blue-950 text-blue-300 border border-blue-800 rounded">
                  Dual-Facing System
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Center Repositories · National Archives (NAP) Disposal Monitoring · Messenger Logistics
              </p>
            </div>
          </div>

          {/* Right Controls: View Switcher & Notification Inbox */}
          <div className="flex items-center gap-3 self-end md:self-center">
            {/* View Switcher: Public/Center View vs Executive Dashboard */}
            <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700/80">
              <button
                onClick={() => setActiveView('public')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeView === 'public'
                    ? 'bg-blue-700 text-white shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Public &amp; Centers View</span>
              </button>
              <button
                onClick={() => setActiveView('executive')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 relative cursor-pointer ${
                  activeView === 'executive'
                    ? 'bg-blue-700 text-white shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Executive Dashboard</span>
                {pendingRequestsCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {pendingRequestsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Notification Drawer Button */}
            <button
              onClick={onOpenNotifications}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 relative cursor-pointer transition-colors"
              title="Automated Delivery Notifications & Link Delivery"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center animate-bounce">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Sub-navigation for Public/Center View */}
        {activeView === 'public' && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveModuleTab('forms')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeModuleTab === 'forms'
                    ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Downloadable Forms Repository
              </button>
              <button
                onClick={() => setActiveModuleTab('issuances')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  activeModuleTab === 'issuances'
                    ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Issuances &amp; RCSO Repository
              </button>
              <button
                onClick={() => setActiveModuleTab('logistics')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeModuleTab === 'logistics'
                    ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Messenger Logistics Tracker</span>
              </button>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Public Access Mode · No Login Required for Browsing</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
