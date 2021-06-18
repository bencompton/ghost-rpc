import { IProduct } from '../services/product-search-service';

export const products = [{
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
}] as IProduct[];

export default class {
  public getFeaturedProducts() {
    const featuredProductIds = [3, 4];

    return products.filter(product => featuredProductIds.indexOf(product.id) !== -1);
  }

  public getProductSearchResults(searchText: string) {
    return products
      .filter((product) => {
        return product.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
      });
  }

  public getProductSearchSuggestions(searchText: string) {
    return this.getProductSearchResults(searchText)
      .map(product => product.name);
  }
}
