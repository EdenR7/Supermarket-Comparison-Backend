import CartMember from "../db/models/cartMember";
import { CustomError } from "./errors/CustomError";

export async function cartAdminAction(
  cart_id: number,
  user_id: number,
  callback: () => Promise<void>
) {
  try {
    const member = await CartMember.findOne({ where: { cart_id, user_id } });
    if (!member)
      throw new CustomError("You are not a member of this cart", 403);
    if (!member.is_admin)
      throw new CustomError("Only cart admins can perform this action", 403);

    await callback();
  } catch (error) {
    throw error;
  }
}
