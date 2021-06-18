import { IAppServiceContext } from '.';
import { ICartRepository } from '../mock-repositories';

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
}
