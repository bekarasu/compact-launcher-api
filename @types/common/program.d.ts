export interface IProgramImage {
  path: string;
}

// useful for client side
export interface IProgram {
  name: string;
  sku: string;
  slug: string;
  price: number;
  content: string;
  status: boolean;
  brand?: number;
  discount?: number;
  images: Array<IProgramImage>;
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date | null
}
