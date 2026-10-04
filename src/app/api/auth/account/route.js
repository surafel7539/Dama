import { deleteAccount } from "@/server/controllers/authController";
import { callController } from "@/server/http";

export async function DELETE(request) {
  return callController(request, deleteAccount, { requireAuth: true });
}
