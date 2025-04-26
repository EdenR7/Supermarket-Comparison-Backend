import { Op } from "sequelize";
import { getPagination } from "../utils/pagination";

interface UserCriteria {
  username?: string;
  email?: string;
  page?: number;
  size?: number;
}

export function buildUserQuery(query: UserCriteria) {
  const { page = 1, size = 3, username, email } = query;
  const { limit, offset } = getPagination(Number(page), Number(size));

  const whereClause: any = {};
  if (username) whereClause.username = { [Op.iLike]: `%${username}%` };
  if (email) whereClause.email = { [Op.iLike]: `%${email}%` };

  return { limit, offset, whereClause };
}
