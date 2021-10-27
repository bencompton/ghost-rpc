import { IAppServiceContext } from '.';
import { ICartRepository } from '../repositories';

export default class {
  private context: IAppServiceContext;
  private cartRepository: ICartRepository;

  constructor(
    context: IAppServiceContext,
    cartRepository: ICartRepository
  ) {
    this.context = context;
    this.cartRepository = cartRepository;
  }

  public addToCart(productId: number) {
    return this.cartRepository.addToCart(this.context.loggedInUserId, productId);
  }

  public loadMyCart() {
    return this.cartRepository.getProductsInCart(this.context.loggedInUserId);
  }

  public async proceedToCheckout() {
    this.cartRepository.clearCart(this.context.loggedInUserId);
  }
}
