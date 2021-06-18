import { defineFeature, loadFeature, DefineStepFunction } from 'jest-cucumber';

import CartWorkflow from '../test-workflows/CartWorkflow';
import ProductSearchWorkflow from '../test-workflows/ProductSearchWorkflow';
import CheckoutWorkflow from '../test-workflows/CheckoutWorkflow';

const feature = loadFeature('src/test/integration-tests/features/AddingToCart.feature');

defineFeature(feature, (test) => {
  let cartWorkflow: CartWorkflow;
  let productSearchWorkflow: ProductSearchWorkflow;
  let checkoutWorkflow: CheckoutWorkflow;

  beforeEach(() => {
    cartWorkflow = new CartWorkflow();
    productSearchWorkflow = new ProductSearchWorkflow(cartWorkflow.context);
    checkoutWorkflow = new CheckoutWorkflow(cartWorkflow.context);

    return cartWorkflow.startApp();
  });

  const givenIHaveAddedAProductToMyCart = (given: DefineStepFunction) => {
    given(/I (have|previously) added a product to my cart/, async () => {
      const firstSearchProductId = productSearchWorkflow.currentSearchResults[0].id;

      await cartWorkflow.addProductToCart(firstSearchProductId);
    });
  };

  const whenIAddAProductToMyCart = (when: DefineStepFunction) => {
    when('I add a product to my cart', async () => {
      await cartWorkflow.addProductToCart(productSearchWorkflow.currentSearchResults[0].id);
    });
  };

  test('Adding a product to cart', ({ given, when, then }) => {
    given(/I have (\d+) products in my cart/, async (productsInCart) => {
      // Proceed to checkout to clear cart
      await checkoutWorkflow.proceedToCheckout();

      expect(cartWorkflow.cartBadge).toBe(parseInt(productsInCart, 10));
    });

    whenIAddAProductToMyCart(when);

    then(/I should have (\d+) product in my cart/, (productCount) => {
      expect(cartWorkflow.cartBadge).toBe(parseInt(productCount, 10));
    });
  });

  test('Viewing my cart', ({ given, when, then }) => {
    givenIHaveAddedAProductToMyCart(given);

    when('I view my cart', async () => {
      await cartWorkflow.viewCart();
    });

    then('I should see that product in my cart', () => {
      const productIdsInCart = cartWorkflow.cartScreen.productsInCart.map(product => product.id);
      const firstSearchProductId = productSearchWorkflow.currentSearchResults[0].id;

      expect(productIdsInCart.indexOf(firstSearchProductId)).not.toBe(-1);
    });
  });

  test('Product already in cart', ({ given, when, then, pending }) => {
    givenIHaveAddedAProductToMyCart(given);

    when('I view that product', () => {
      // Product is already in current search results
    });

    then('the product should indicate it is already in my cart', () => {
      expect(productSearchWorkflow.currentSearchResults[0].isInCart).toBe(true);
    });
  });
});
