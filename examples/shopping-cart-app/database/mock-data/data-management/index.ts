import { Connection } from 'typeorm';

import addCartProducts from './add-cart-products';
import addFeaturedProducts from './add-featured-products';
import addProducts from './add-products';

export const addAllMockData = async (connection: Connection) => {
  await Promise.all([
    addCartProducts(connection),
    addProducts(connection),
    addFeaturedProducts(connection)
  ]);
};
