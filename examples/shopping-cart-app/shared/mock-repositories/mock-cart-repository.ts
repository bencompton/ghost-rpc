import { products } from './mock-product-search-repository';

const productsInCartForAllUsers: { [userId: number]: number[] } = {
  1: [1]
};

export default class {
  public getProductsInCart(userId: number) {
    const productsInCart = products
      .filter(product => productsInCartForAllUsers[userId].indexOf(product.id) !== -1);    

    return Promise.resolve(productsInCart);
  }

  public addToCart(userId: number, productId: number) {
    productsInCartForAllUsers[userId].push(productId);

    return Promise.resolve();
  }
}
