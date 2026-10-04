import React from 'react';
import { 
  X, 
  Bell, 
  CheckCircle2, 
  Lock, 
  Truck, 
  Trash2, 
  ExternalLink, 
  Clock, 
  Mail,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onOpenTokenTerminalWithToken: (token: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onOpenTokenTerminalWithToken,
  onMarkAllAsRead
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300"
        role="dialog"
      >
        {/* Header - Clean Light Styling */}
        <div className="bg-slate-50 text-slate-900 p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-600">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-slate-900">
                Automated Delivery Inbox &amp; Alerts
              </h2>
              <p className="text-[11px] text-slate-500">
                Official DSWD Notification Dispatch
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3 text-xs text-blue-950 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>Module A Specification:</strong> When restricted document access is approved by management, the system dynamically delivers a secured, time-sensitive download link to the user's registered DSWD email shown below.
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="p-10 text-center text-slate-400 space-y-2">
              <Bell className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs">No recent notifications</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 rounded-xl border transition-all text-xs space-y-2 ${
                  !notif.read
                    ? 'bg-amber-50/60 border-amber-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    {notif.type === 'access_approved' && (
                      <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                    {notif.type === 'delivery_update' && (
                      <Truck className="w-3.5 h-3.5 text-blue-600" />
                    )}
                    {notif.type === 'disposal_update' && (
                      <Trash2 className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    <span>{notif.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {notif.message}
                </p>

                {/* If approved with secure token */}
                {notif.secureToken && (
                  <div className="pt-2 border-t border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Secured Access Token:</span>
                      <code className="font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                        {notif.secureToken}
                      </code>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onOpenTokenTerminalWithToken(notif.secureToken!);
                      }}
                      className="w-full py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Time-Sensitive Download Link</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-400">
          Department of Social Welfare and Development · Automated Mail Delivery
        </div>
      </div>
    </div>
  );
};
