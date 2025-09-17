// components/ui/NotificationSystem.tsx
import React, { useMemo } from 'react';
import { useGameStore } from '../../stores/useGameStore';

const NotificationSystem: React.FC = React.memo(() => {
  const { notifications, clearNotification } = useGameStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => clearNotification(notification.id)}
        />
      ))}
    </div>
  );
});

NotificationSystem.displayName = 'NotificationSystem';

interface NotificationItemProps {
  notification: {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  };
  onClose: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = React.memo(({ notification, onClose }) => {
  const bgColor = useMemo(() => {
    switch (notification.type) {
      case 'success': return 'bg-green-600';
      case 'error': return 'bg-red-600';
      case 'warning': return 'bg-yellow-600';
      default: return 'bg-slate-600';
    }
  }, [notification.type]);

  return (
    <div className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg max-w-sm animate-in slide-in-from-right`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{notification.message}</p>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
});

NotificationItem.displayName = 'NotificationItem';

export default NotificationSystem;