export type Route = {
  readonly params?: { readonly id?: string };
};

export interface Client {
  phone: string;
  name: string;
}

export interface Payment {
  price: string;
  deadline: Date;
}

export interface Vehicle {
  id: string;
  name: string;
  deadline: Date;
  client: Client;
  payment: Payment;
  gaurantor: Gaurantor;
  count?: number;
}

export interface Settings {
  enabledSMS: boolean;
  time: string;
  smsModel: string;
  remainSmsModel: string;
  periods: string;
  enabledBackup: boolean;
  backupPeriod: string;
}

export interface Gaurantor {
  phone: string;
  name: string;
}

export interface Count {
  vehicle_id: string;
  count: number;
}

export interface SelectboxListItem {
  readonly id: string;
  readonly item: string;
}
