import { Op } from "sequelize";
import Category from "../db/models/category";
import ProductPrice from "../db/models/productPrice";
import Supermarket from "../db/models/supermarket";
import { getPagination } from "../utils/pagination";
import {
  FullProductDetails,
  JoinedProductDetails,
} from "src/types/product.types";

interface ProductCriteria {
  name?: string;
  category?: string;
  page?: number;
  size?: number;
}

export function buildProductQuery(query: ProductCriteria) {
  const { name, category, page = 1, size = 5 } = query;
  const { limit, offset } = getPagination(Number(page), Number(size));

  // Build the main product criteria
  const criteria: any = {};
  if (name) {
    criteria.name = { [Op.iLike]: `%${name}%` };
  }

  // Build the include options
  const includeOptions = [
    {
      model: Category,
      attributes: ["id", "name"],
      ...(category
        ? {
            where: {
              name: { [Op.iLike]: `%${category}%` },
            },
          }
        : {}),
    },
    {
      model: ProductPrice,
      include: [
        {
          model: Supermarket,
          attributes: ["id", "name", "brand_img"],
        },
      ],
    },
  ];

  return {
    where: criteria,
    include: includeOptions,
    limit,
    offset,
    distinct: true,
    order: [["id", "ASC"] as any],
  };
}

export function transformProductToFullDetails(
  product: JoinedProductDetails
): FullProductDetails {
  return {
    id: product.id,
    name: product.name,
    img_url: product.img_url,
    category: product.Category?.name || "",
    prices: product.ProductPrices.map((pp) => ({
      id: pp.id,
      price: pp.price,
      last_updated: pp.last_updated,
      supermarket: pp.Supermarket.name,
    })),
  };
}
