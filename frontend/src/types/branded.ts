// types/branded.ts
export type CrewMemberId = string & { readonly __brand: 'CrewMemberId' };
export type NotificationId = string & { readonly __brand: 'NotificationId' };
export type TradeRouteId = string & { readonly __brand: 'TradeRouteId' };

export const CrewIdGenerator = {
  generate: (): CrewMemberId =>
    `crew_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` as CrewMemberId,

  isValid: (id: string): id is CrewMemberId =>
    typeof id === 'string' && id.startsWith('crew_'),
};

export const NotificationIdGenerator = {
  generate: (): NotificationId =>
    `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` as NotificationId,

  isValid: (id: string): id is NotificationId =>
    typeof id === 'string' && id.startsWith('notification_'),
};

export const TradeRouteIdGenerator = {
  generate: (): TradeRouteId =>
    `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` as TradeRouteId,

  isValid: (id: string): id is TradeRouteId =>
    typeof id === 'string' && id.startsWith('trade_'),
};
