import { NextResponse } from "next/server";
import connectDB from "@/server/config/db";
import Product from "@/server/models/Product";

export async function GET() {
  try {
    await connectDB();
    const categories = await Product.distinct("category");
    return NextResponse.json(categories.map((name) => ({ name })));
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
