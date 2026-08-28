import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Bell, AlertTriangle, CheckCircle2, AlertCircle, Info, Trash2, ExternalLink } from 'lucide-react';
import { AlertSeverity } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const { alerts, markAlertAsRead, clearAllAlerts, setActiveTab } = useApp();

  if (!isOpen) return null;

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-500 shrink-0" />;
    }
  };

  const getSeverityBorder = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return 'border-l-4 border-l-red-500 bg-red-50/50 dark:bg-red-950/20';
      case 'warning':
        return 'border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20';
      case 'success':
        return 'border-l-4 border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20';
      default:
        return 'border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20';
    }
  };

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/50 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="notification-center-drawer"
          className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100">Smart Alerts & Notifications</h3>
                <p className="text-xs text-slate-500">{unreadCount} unread system notifications</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {alerts.length > 0 && (
                <button
                  onClick={clearAllAlerts}
                  className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Clear all alerts"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <CheckCircle2 className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                <p className="font-medium text-slate-600 dark:text-slate-300">All systems operating normally</p>
                <p className="text-xs mt-1">No active compliance or maintenance warnings.</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => markAlertAsRead(alert.id)}
                  className={`p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 transition-all cursor-pointer hover:shadow-sm ${getSeverityBorder(
                    alert.severity
                  )} ${alert.read ? 'opacity-70' : 'shadow-xs'}`}
                >
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {alert.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0">{alert.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {alert.description}
                      </p>
                      {alert.actionUrl && (
                        <div className="mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onClose();
                              const tabName = alert.actionUrl?.replace('/', '') || 'dashboard';
                              setActiveTab(tabName);
                            }}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Resolve / View Details <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-500 text-center">
            Fleet Safety & Compliance Engine • Auto-monitored 24/7
          </div>
        </div>
      </div>
    </div>
  );
};
