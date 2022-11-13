export interface TCategory {
  id: string;
  name: string;
  image: string;
}

export interface TProduct extends TCategory {}

export interface TCartItem {
  id: number;
  product: TProduct;
  is_promoted: boolean;
  price: string;
}

export interface TFamily extends TCategory {
  is_promoted: boolean;
}

export interface TResponse extends Response {
  token: string;
}
