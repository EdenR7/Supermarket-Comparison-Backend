import { Optional } from "sequelize";
import { ProductPriceAttributes, ProductPriceI } from "./productPrice.types";
import { CategoryAttributes } from "./category.types";
import { SupermarketAttributes } from "./supermarket.types";

export interface ProductAttributes {
  id: number;
  name: string;
  img_url: string;
  category_id: number;
}

export interface ProductCreationAttributes
  extends Optional<ProductAttributes, "id"> {}

export interface JoinedProductDetails {
  id: number;
  name: string;
  img_url: string;
  Category: CategoryAttributes;
  ProductPrices: [
    ProductPriceAttributes & {
      Supermarket: SupermarketAttributes;
    }
  ];
}

export interface FullProductDetails {
  id: number;
  name: string;
  img_url: string;
  category: string;
  prices: ProductPriceI[];
}
