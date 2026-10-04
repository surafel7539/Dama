import { getMyProducts } from "@/server/controllers/productController";
import { callController } from "@/server/http";

export async function GET(request) {
  return callController(request, getMyProducts, { requireAuth: true });
}
