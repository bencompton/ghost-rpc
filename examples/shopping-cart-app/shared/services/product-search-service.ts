import { IProductSearchRepository } from '../mock-repositories';

export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export default class {
  private productSearchRepository: IProductSearchRepository;

  constructor(productSearchRepository: IProductSearchRepository) {
    this.productSearchRepository = productSearchRepository;
  }

  public getFeaturedProducts() {
    return this.productSearchRepository.getFeaturedProducts();
  }

  public getSearchSuggestions(searchText: string) {
    return this.productSearchRepository.getProductSearchSuggestions(searchText);
  }

  public searchForProduct(searchText: string) {
    return this.productSearchRepository.getProductSearchResults(searchText);
  }  
}
