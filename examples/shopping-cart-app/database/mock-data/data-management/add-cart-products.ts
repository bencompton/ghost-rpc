import { Connection } from 'typeorm';

import { Cart } from '../../schema';
import { getCartProducts } from '../data/cart';
import addMockData from '../utils/add-mock-data';

export default async (connection: Connection) => {
  await addMockData(connection, Cart, getCartProducts());
};
