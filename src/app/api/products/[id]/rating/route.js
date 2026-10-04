import {
  addProductRating,
  deleteProductRating,
} from "@/server/controllers/productController";
import { callController } from "@/server/http";

export async function POST(request, context) {
  const params = await context.params;
  return callController(request, addProductRating, {
    requireAuth: true,
    params,
  });
}

export async function DELETE(request, context) {
  const params = await context.params;
  return callController(request, deleteProductRating, {
    requireAuth: true,
    params,
  });
}
