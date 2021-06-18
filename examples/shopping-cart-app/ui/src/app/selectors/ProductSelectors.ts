import { IAppState } from '../store';

export const getDownloadedProducts = (state: IAppState) => {
  return state.products.downloadedProducts;
};
