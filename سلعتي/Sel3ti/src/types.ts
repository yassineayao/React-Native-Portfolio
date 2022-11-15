export interface TCategory {
  id: string;
  name: string;
  image: string;
}

export interface TProduct extends TCategory {}

export interface TOrderItem {
  id: number;
  product: TProduct;
  is_promoted: boolean;
  price: string;
  quantity: number;
}

export interface TFamily extends TCategory {
  is_promoted: boolean;
}

export interface TResponse extends Response {
  token: string;
}

export interface TSataticPoint {
  title: string;
  point: number;
  progress: number;
  style: string;
}

export interface TUser {
  name: string;
  phone: string;
  address: string;
}

export interface TDistributor extends TUser {}

export interface TInvoice {
  id: string;
  order: TOrderItem[];
  distributor: TDistributor;
  client: TUser;
  date: Date;
}
