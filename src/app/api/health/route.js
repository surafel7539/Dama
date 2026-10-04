import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Dama Marketplace API is live and secure!",
  });
}
