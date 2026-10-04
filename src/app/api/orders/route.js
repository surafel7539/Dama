import { createOrder } from "@/server/controllers/orderController";
import { callController } from "@/server/http";

export async function POST(request) {
  return callController(request, createOrder, { requireAuth: true });
}
