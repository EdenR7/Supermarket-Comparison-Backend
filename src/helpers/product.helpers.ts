import { Op } from "sequelize";
import Category from "../../sequelize/models/category";
import ProductPrice from "../../sequelize/models/productPrice";
import Supermarket from "../../sequelize/models/supermarket";
import { getPagination } from "../utils/pagination";

interface ProductCriteria {
  name?: string;
  category?: string;
  page?: number;
  size?: number;
}

export function buildProductQuery(query: ProductCriteria) {
  const { name, category, page = 0, size = 3 } = query;
  const { limit, offset } = getPagination(page, size);

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
