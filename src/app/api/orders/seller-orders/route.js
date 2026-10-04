import { getSellerOrders } from "@/server/controllers/orderController";
import { callController } from "@/server/http";

export async function GET(request) {
  return callController(request, getSellerOrders, { requireAuth: true });
}
