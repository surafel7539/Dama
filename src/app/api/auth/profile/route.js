import { getProfile, updateProfile } from "@/server/controllers/authController";
import { callController } from "@/server/http";

export async function GET(request) {
  return callController(request, getProfile, { requireAuth: true });
}

export async function PUT(request) {
  return callController(request, updateProfile, { requireAuth: true });
}
