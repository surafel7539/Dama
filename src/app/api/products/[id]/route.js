import {
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/server/controllers/productController";
import { callController, readProductForm } from "@/server/http";

export async function GET(request, context) {
  const params = await context.params;
  return callController(request, getProductById, { params });
}

export async function PUT(request, context) {
  const params = await context.params;
  const type = request.headers.get("content-type") || "";

  if (type.includes("multipart/form-data")) {
    const { body, file } = await readProductForm(request);
    return callController(request, updateProduct, {
      requireAuth: true,
      params,
      body,
      file,
    });
  }

  return callController(request, updateProduct, {
    requireAuth: true,
    params,
  });
}

export async function DELETE(request, context) {
  const params = await context.params;
  return callController(request, deleteProduct, {
    requireAuth: true,
    params,
  });
}
