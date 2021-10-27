import { IProductSearchRepository } from '../repositories';

export default class {
  private productSearchRepository: IProductSearchRepository;

  constructor(productSearchRepository: IProductSearchRepository) {
    this.productSearchRepository = productSearchRepository;
  }

  public getFeaturedProducts() {
    return this.productSearchRepository.getFeaturedProducts();
  }

  public searchForProduct(searchText: string) {
    return this.productSearchRepository.getProductSearchResults(searchText);
  }  
}
