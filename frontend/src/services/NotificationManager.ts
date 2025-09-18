// services/NotificationManager.ts
import type { Notification, NotificationTypeType } from '../types/game';
import { NotificationIdGenerator } from '../types/branded';
import gameConfig from '../config/gameConfig';

export class NotificationManager {
  static create(message: string, type: NotificationTypeType = 'info'): Notification {
    return {
      id: NotificationIdGenerator.generate(),
      message,
      type,
      timestamp: Date.now()
    };
  }

  static autoRemove(notification: Notification, removeCallback: (id: Notification['id']) => void): void {
    setTimeout(
      () => removeCallback(notification.id),
      gameConfig.intervals.notificationTimeout
    );
  }

  static formatMessage(template: string, variables: Record<string, string | number>): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return variables[key]?.toString() || match;
    });
  }

  static createResourceMessage(
    action: 'bought' | 'sold' | 'gained' | 'spent',
    amount: number,
    resource: string,
    cost?: number
  ): string {
    const actionPast = {
      bought: 'Bought',
      sold: 'Sold',
      gained: 'Gained',
      spent: 'Spent'
    };

    const costText = cost ? ` for ${cost} credits` : '';
    return `${actionPast[action]} ${amount} ${resource}${costText}`;
  }

  static createCrewMessage(
    action: 'recruited' | 'trained' | 'promoted',
    crewName: string,
    details?: string
  ): string {
    const actionPast = {
      recruited: 'Recruited',
      trained: 'Trained',
      promoted: 'Promoted'
    };

    const detailText = details ? `: ${details}` : '';
    return `${actionPast[action]} ${crewName}${detailText}`;
  }

  static createSystemMessage(
    action: 'explored' | 'colonized',
    systemName: string,
    result?: string
  ): string {
    const actionPast = {
      explored: 'Explored',
      colonized: 'Established colony in'
    };

    const resultText = result ? `. ${result}` : '';
    return `${actionPast[action]} ${systemName}${resultText}`;
  }
}