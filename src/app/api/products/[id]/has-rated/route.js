import { hasRatedProduct } from "@/server/controllers/productController";
import { callController } from "@/server/http";

export async function GET(request, context) {
  const params = await context.params;
  return callController(request, hasRatedProduct, {
    requireAuth: true,
    params,
  });
}
