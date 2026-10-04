import { login } from "@/server/controllers/authController";
import { callController } from "@/server/http";

export async function POST(request) {
  return callController(request, login);
}
