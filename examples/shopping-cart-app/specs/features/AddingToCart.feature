Feature: Adding to cart
  In order to facilitate purchasing multiple products in one transaction
  As a shopper
  I would like the ability to add products to my cart

  Scenario: Adding a product to cart
    Given I have 0 products in my cart
    When I add a product to my cart
    Then I should have 1 product in my cart

  Scenario: Viewing my cart
    Given I have added a product to my cart
    When I view my cart
    Then I should see that product in my cart

  Scenario: Product already in cart
    Given I previously added a product to my cart
    When I view that product
    Then the product should indicate it is already in my cart