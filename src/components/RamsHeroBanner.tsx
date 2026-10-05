import React, { useState } from 'react';
import { 
  ChevronDown, 
  Upload, 
  FileText, 
  FileSpreadsheet, 
  Lock, 
  BarChart3, 
  Truck, 
  Bell, 
  Info,
  CheckCircle,
  PlusCircle,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
import { DocumentCategory, IssuanceType } from '../types';

interface RamsHeroBannerProps {
  activeView: 'public' | 'executive';
  setActiveView: (view: 'public' | 'executive') => void;
  activeModuleTab: 'forms' | 'issuances' | 'logistics';
  setActiveModuleTab: (tab: 'forms' | 'issuances' | 'logistics') => void;
  onOpenUploadForm: () => void;
  onOpenUploadIssuance: () => void;
  onSelectCategoryFilter?: (cat: string) => void;
  onSelectIssuanceTypeFilter?: (type: string) => void;
  pendingRequestsCount: number;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  onOpenTokenVerifier: () => void;
}

export const RamsHeroBanner: React.FC<RamsHeroBannerProps> = ({
  activeView,
  setActiveView,
  activeModuleTab,
  setActiveModuleTab,
  onOpenUploadForm,
  onOpenUploadIssuance,
  onSelectCategoryFilter,
  onSelectIssuanceTypeFilter,
  pendingRequestsCount,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenTokenVerifier
}) => {
  const [templatesDropdownOpen, setTemplatesDropdownOpen] = useState(false);
  const [issuancesDropdownOpen, setIssuancesDropdownOpen] = useState(false);

  return (
    <div className="w-full bg-white select-none">
      {/* Top Navigation Bar matching screenshot: AD-RAMS on left, Menu on right */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between border-b border-slate-100 relative z-30">
        {/* Brand: AD-RAMS */}
        <div 
          onClick={() => { setActiveView('public'); setActiveModuleTab('forms'); }}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-blue-900 transition-colors">
            AD-RAMS
          </span>
          <span className="hidden md:inline-block text-[11px] font-medium text-slate-400 pl-2 border-l border-slate-300">
            Administrative Division · Records &amp; Archives Management Section
          </span>
        </div>

        {/* Right Menu Links */}
        <div className="flex items-center gap-1 sm:gap-4 md:gap-6 text-xs sm:text-sm font-medium text-slate-800">
          <button
            onClick={() => { setActiveView('public'); setActiveModuleTab('forms'); }}
            className={`transition-colors py-1 cursor-pointer font-semibold ${
              activeView === 'public' && activeModuleTab === 'forms' 
                ? 'text-blue-900 font-bold border-b-2 border-blue-900' 
                : 'text-slate-800 hover:text-blue-900'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => { setActiveView('public'); setActiveModuleTab('forms'); }}
            className="text-slate-800 hover:text-blue-900 transition-colors py-1 cursor-pointer hidden sm:block"
          >
            Resources
          </button>

          {/* Templates ⌵ Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setTemplatesDropdownOpen(!templatesDropdownOpen);
                setIssuancesDropdownOpen(false);
              }}
              className={`flex items-center gap-1 py-1 transition-colors cursor-pointer font-semibold ${
                activeView === 'public' && activeModuleTab === 'forms'
                  ? 'text-blue-900'
                  : 'text-slate-800 hover:text-blue-900'
              }`}
            >
              <span>Templates</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${templatesDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {templatesDropdownOpen && (
              <div 
                className="absolute right-0 sm:left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 text-xs"
                onMouseLeave={() => setTemplatesDropdownOpen(false)}
              >
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Templates Repository
                </div>
                <button
                  onClick={() => {
                    setActiveView('public');
                    setActiveModuleTab('forms');
                    onSelectCategoryFilter?.('All');
                    setTemplatesDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-900 flex items-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-blue-700" />
                  <span>Browse All Templates</span>
                </button>
                <button
                  onClick={() => {
                    setActiveView('public');
                    setActiveModuleTab('forms');
                    onSelectCategoryFilter?.('Inventory Sheets');
                    setTemplatesDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-900 cursor-pointer"
                >
                  Inventory Sheets (RIIR Annex A)
                </button>
                <button
                  onClick={() => {
                    setActiveView('public');
                    setActiveModuleTab('forms');
                    onSelectCategoryFilter?.('Disposal Requests');
                    setTemplatesDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-900 cursor-pointer"
                >
                  Disposal Requests (GRDS Annex B)
                </button>
                <div className="my-1 border-t border-slate-100"></div>
                <button
                  onClick={() => {
                    onOpenUploadForm();
                    setTemplatesDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-blue-800 font-bold bg-blue-50/60 hover:bg-blue-100/80 flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>+ Upload New Template</span>
                </button>
              </div>
            )}
          </div>

          {/* Administrative Issuances ⌵ Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIssuancesDropdownOpen(!issuancesDropdownOpen);
                setTemplatesDropdownOpen(false);
              }}
              className={`flex items-center gap-1 py-1 transition-colors cursor-pointer font-semibold ${
                activeView === 'public' && activeModuleTab === 'issuances'
                  ? 'text-blue-900'
                  : 'text-slate-800 hover:text-blue-900'
              }`}
            >
              <span>Administrative Issuances</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${issuancesDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {issuancesDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 text-xs"
                onMouseLeave={() => setIssuancesDropdownOpen(false)}
              >
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Issuances &amp; RSO Repository
                </div>
                <button
                  onClick={() => {
                    setActiveView('public');
                    setActiveModuleTab('issuances');
                    onSelectIssuanceTypeFilter?.('All');
                    setIssuancesDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-900 flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-700" />
                  <span>All Official Issuances</span>
                </button>
                <button
                  onClick={() => {
                    setActiveView('public');
                    setActiveModuleTab('issuances');
                    onSelectIssuanceTypeFilter?.('Administrative Order');
                    setIssuancesDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-900 cursor-pointer"
                >
                  Administrative Orders (AO)
                </button>
                <button
                  onClick={() => {
                    setActiveView('public');
                    setActiveModuleTab('issuances');
                    onSelectIssuanceTypeFilter?.('Memorandum Circular');
                    setIssuancesDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-900 cursor-pointer"
                >
                  Memorandum Circulars (MC)
                </button>
                <button
                  onClick={() => {
                    setActiveView('public');
                    setActiveModuleTab('issuances');
                    onSelectIssuanceTypeFilter?.('Regional Special Order (RSO)');
                    setIssuancesDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-900 flex items-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3 h-3 text-rose-700" />
                  <span>RSO (Regional Special Order)</span>
                </button>
                <div className="my-1 border-t border-slate-100"></div>
                <button
                  onClick={() => {
                    onOpenUploadIssuance();
                    setIssuancesDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-blue-800 font-bold bg-blue-50/60 hover:bg-blue-100/80 flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>+ Upload New Issuance / RSO</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Access to Executive & Logistics */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <button
              onClick={() => setActiveView('executive')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer relative ${
                activeView === 'executive'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100'
              }`}
              title="Executive Monitoring Dashboard"
            >
              <BarChart3 className="w-4 h-4" />
              {pendingRequestsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {pendingRequestsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveView('public'); setActiveModuleTab('logistics'); }}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                activeView === 'public' && activeModuleTab === 'logistics'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100'
              }`}
              title="Messenger Logistics Tracker"
            >
              <Truck className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenNotifications}
              className="p-1.5 rounded-lg text-slate-600 hover:text-blue-900 hover:bg-slate-100 transition-colors cursor-pointer relative"
              title="Notifications & Secure Token Links"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-bold flex items-center justify-center animate-bounce">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Banner Section with Exact Geometric Vector Art - Pure White Modern Background */}
      <div className="relative w-full overflow-hidden bg-white min-h-[200px] sm:min-h-[260px] md:min-h-[300px] flex items-center justify-center border-b border-slate-100">
        {/* Geometric Graphics: Lightened, vibrant modern Philippine government palette */}
        
        {/* Top-Left / Center-Left Lighter Blue & Sunny Yellow Polygons */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden select-none">
          {/* Vibrant Royal Blue Top-Left Triangle */}
          <div 
            className="absolute -top-8 -left-12 w-44 h-40 bg-[#1e40af] opacity-90" 
            style={{ clipPath: 'polygon(0 0, 100% 0, 45% 100%, 0% 80%)' }}
          />
          {/* Bright Sun Yellow Polygon Top-Left */}
          <div 
            className="absolute top-0 left-0 w-48 h-36 bg-[#facc15] opacity-95" 
            style={{ clipPath: 'polygon(0 0, 95% 0, 15% 100%, 0 60%)' }}
          />
          {/* Vivid Sky/Cobalt Chevron */}
          <div 
            className="absolute top-6 left-10 w-40 h-28 bg-[#2563eb] opacity-90" 
            style={{ clipPath: 'polygon(20% 0, 85% 0, 50% 100%, 0% 70%)' }}
          />

          {/* Center Top Angled Blue Hexagon - Lightened to Royal Blue */}
          <div 
            className="absolute -top-12 left-1/4 sm:left-1/3 w-64 h-44 bg-[#1d4ed8] opacity-85"
            style={{ clipPath: 'polygon(50% 0%, 100% 30%, 80% 100%, 20% 100%, 0% 30%)' }}
          />
          {/* Light Golden outline hexagon overlapping top */}
          <svg className="absolute -top-6 left-1/4 sm:left-[30%] w-60 h-44 opacity-80" viewBox="0 0 200 150">
            <polygon 
              points="100,5 190,50 160,140 40,140 10,50" 
              fill="none" 
              stroke="#fbbf24" 
              strokeWidth="2.5" 
            />
          </svg>

          {/* Bottom Center Blue Polygon - Lighter Modern Royal */}
          <div 
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-64 h-36 bg-[#1e40af] opacity-90"
            style={{ clipPath: 'polygon(50% 0%, 95% 45%, 80% 100%, 20% 100%, 5% 45%)' }}
          />
          {/* Light Yellow wireframe hexagon at bottom */}
          <svg className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-64 h-36 opacity-90" viewBox="0 0 200 120">
            <polygon 
              points="100,8 185,48 160,115 40,115 15,48" 
              fill="none" 
              stroke="#facc15" 
              strokeWidth="2" 
            />
          </svg>

          {/* Bottom Right Angled Bands: Luminous Coral/Crimson, Sun Yellow, Royal Blue */}
          <div 
            className="absolute -bottom-6 -right-8 w-80 sm:w-96 h-60 bg-[#f43f5e] opacity-95"
            style={{ clipPath: 'polygon(45% 0, 100% 0, 65% 100%, 15% 100%)' }}
          />
          <div 
            className="absolute -bottom-4 right-0 w-64 sm:w-80 h-56 bg-[#fbbf24] opacity-95"
            style={{ clipPath: 'polygon(55% 0, 100% 0, 75% 100%, 28% 100%)' }}
          />
          <div 
            className="absolute -bottom-2 -right-4 w-44 sm:w-56 h-48 bg-[#1e40af] opacity-90"
            style={{ clipPath: 'polygon(60% 0, 100% 0, 100% 100%, 40% 100%)' }}
          />
        </div>

        {/* Central Title: "RAMS PORTAL" in Crisp, Lighter Royal Blue Typography */}
        <div className="relative z-10 text-center px-4 py-8 max-w-4xl mx-auto">
          <h1 
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-[#1e3a8a] leading-none uppercase select-none drop-shadow-xs"
            style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif' }}
          >
            RAMS PORTAL
          </h1>
          <p className="text-xs sm:text-sm font-bold tracking-widest text-[#2563eb] mt-2.5 uppercase">
            Records and Archives Management Section
          </p>
        </div>
      </div>
    </div>
  );
};
