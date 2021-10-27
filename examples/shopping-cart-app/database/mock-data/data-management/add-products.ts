import { Connection } from 'typeorm';

import { Product } from '../../schema';
import { getProducts } from '../data/products';

import addMockData from '../utils/add-mock-data';

export default async (connection: Connection) => {
  await addMockData(connection, Product, getProducts());
};
