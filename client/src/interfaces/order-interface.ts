export enum STATUSES {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  SUCCESS = 'SUCCESS',
  PENDING = 'PENDING'
};

export interface Client {
  name: string;
  phone: string;
  email: string;
  comment: string;
}

export interface Apartment {
  id: number;
  name: string;
  from: string;
  to: string;
}

export interface Info {
  client: Client;
  totalPrice: number;
  apartment: Apartment;

}

export interface IComment {
  id: number;
  body: string;
  order_id: number|null;
}
export interface IOrder {
  id: number;
  status: STATUSES;
  createdAt: string;
  info: Info;
  comments: IComment[];
}