import { getBuyerOrderById } from "@/server/controllers/orderController";
import { callController } from "@/server/http";

export async function GET(request, context) {
  const params = await context.params;
  return callController(request, getBuyerOrderById, {
    requireAuth: true,
    params,
  });
}
