import { Product } from '../../schema';

export const getProducts = (): Product[] => [{
  id: 1,
  name: 'iPhone',
  description: 'Apple iPhone',
  price: 399,
  image: 'iphone.jpg'
}, {
  id: 2,
  name: 'Samsung Galaxy',
  description: 'Samsung Galaxy',
  price: 299,
  image: 'samsung-galaxy.jpg'
}, {
  id: 3,
  name: 'Macbook Pro',
  description: 'Macbook Pro',
  price: 1299,
  image: 'macbook-pro.jpg'
}, {
  id: 4,
  name: 'Dell XPS 13',
  description: 'Dell XPS 13',
  price: 999,
  image: 'dell-xps-13.jpg'
}];
