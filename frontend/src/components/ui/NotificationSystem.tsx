// components/ui/NotificationSystem.tsx
import React, { useMemo } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { uiConstants } from '../../constants/uiConstants';
import type { NotificationId } from '../../types/branded';

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
    id: NotificationId;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  };
  onClose: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = React.memo(
  ({ notification, onClose }) => {
    const bgColor = useMemo(() => {
      switch (notification.type) {
        case 'success':
          return uiConstants.COLORS.BG_SUCCESS;
        case 'error':
          return uiConstants.COLORS.BG_ERROR;
        case 'warning':
          return uiConstants.COLORS.BG_WARNING;
        default:
          return uiConstants.COLORS.BG_TERTIARY;
      }
    }, [notification.type]);

    return (
      <div
        className={`${bgColor} ${uiConstants.COLORS.TEXT_PRIMARY} px-4 py-3 rounded-lg shadow-lg max-w-sm animate-in slide-in-from-right`}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{notification.message}</p>
          <button
            onClick={onClose}
            className={`ml-4 ${uiConstants.COLORS.TEXT_PRIMARY} ${uiConstants.COLORS.HOVER_TEXT_MUTED} transition-colors`}
          >
            ×
          </button>
        </div>
      </div>
    );
  }
);

NotificationItem.displayName = 'NotificationItem';

export default NotificationSystem;
