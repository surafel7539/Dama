import { chatWithAI } from "@/server/controllers/aiController";
import { callController } from "@/server/http";

export async function POST(request) {
  return callController(request, chatWithAI);
}
