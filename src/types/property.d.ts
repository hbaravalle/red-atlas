export interface Property {
  id: string;
  title: string;
  description: string;
  location: {
    lat: string;
    lng: string;
  };
  address: string;
  images: string[];
  type: string;
  status: string;
  isActive: boolean;
  price: number;
  area: number;
  createdAt: string;
  updatedAt: string;
  owner: {
    name: string;
    contact: string;
  };
}
