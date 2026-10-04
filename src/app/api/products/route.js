import { createProduct, getProducts } from "@/server/controllers/productController";
import { callController, readProductForm } from "@/server/http";

export async function GET(request) {
  return callController(request, getProducts);
}

export async function POST(request) {
  const { body, file } = await readProductForm(request);
  return callController(request, createProduct, {
    requireAuth: true,
    body,
    file,
  });
}
