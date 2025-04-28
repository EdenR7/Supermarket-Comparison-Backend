import User from "./user";
import Supermarket from "./supermarket";
import Category from "./category";
import Product from "./product";
import ProductPrice from "./productPrice";
import Cart from "./cart";
import CartMember from "./cartMember";
import CartItem from "./cartItem";

const models = {
  User,
  Supermarket,
  Category,
  Product,
  ProductPrice,
  Cart,
  CartMember,
  CartItem,
};

// Run associations for each model
Object.values(models).forEach((model: any) => {
  if (model.associate) {
    model.associate(models);
  }
});

export default models;
