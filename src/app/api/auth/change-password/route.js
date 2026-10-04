import { changePassword } from "@/server/controllers/authController";
import { callController } from "@/server/http";

export async function PUT(request) {
  return callController(request, changePassword, { requireAuth: true });
}
