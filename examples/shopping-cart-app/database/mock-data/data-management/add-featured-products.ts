import { Connection } from 'typeorm';

import { FeaturedProduct } from '../../schema';
import { getFeaturedProducts } from '../data/featured-products';

import addMockData from '../utils/add-mock-data';

export default async (connection: Connection) => {
  await addMockData(connection, FeaturedProduct, getFeaturedProducts());
};
