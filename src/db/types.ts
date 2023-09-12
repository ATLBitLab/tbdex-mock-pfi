import type { MessageModel, MessageKind, ResourceModel } from '@tbdex/http-server'
import type { Generated, JSONColumnType } from 'kysely'

export interface DbOffering {
  id: Generated<number>;
  offeringId: string;
  baseCurrency: string;
  quoteCurrency: string;
  offering: JSONColumnType<ResourceModel<'offering'>, string, string> | null;
}

export interface DbPaymentMethod {
  id: Generated<number>;
  kind: string;
  offeringId: string;
  requiredPaymentDetails: JSONColumnType<object, string, string> | null;
  direction: 'payin' | 'payout';
}

export interface DbExchange {
  id: Generated<number>;
  exchangeId: string;
  messageId: string;
  subject: string;
  createdAt: Generated<Date>;
  messageKind: 'close' | 'order' | 'orderstatus' | 'quote' | 'rfq';
  message: JSONColumnType<MessageModel<MessageKind>, string, string>;
}

export interface Database {
  Exchange: DbExchange;
  Offering: DbOffering;
  PaymentMethod: DbPaymentMethod;
}
