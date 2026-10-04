import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "./config/db";
import cloudinary from "./config/cloudinary";

export async function callController(request, controller, options = {}) {
  try {
    await connectDB();
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const header = request.headers.get("authorization") || "";
  let user = null;

  if (options.requireAuth) {
    if (!header.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Not authorized, token missing" },
        { status: 401 }
      );
    }

    try {
      user = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        { message: "Not authorized, invalid token" },
        { status: 401 }
      );
    }
  }

  let body = options.body;
  if (body === undefined) {
    const type = request.headers.get("content-type") || "";
    if (type.includes("application/json")) {
      body = await request.json().catch(() => ({}));
    } else {
      body = {};
    }
  }

  let statusCode = 200;
  let payload = null;

  const req = {
    body,
    params: options.params || {},
    user,
    file: options.file || null,
    headers: { authorization: header },
  };

  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      payload = data;
      return this;
    },
    clearCookie() {
      return this;
    },
  };

  try {
    await controller(req, res);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error.message || "Request failed" },
      { status: 500 }
    );
  }

  return NextResponse.json(payload ?? {}, { status: statusCode });
}

export async function readProductForm(request) {
  const form = await request.formData();
  const body = {};
  let file = null;

  for (const [key, value] of form.entries()) {
    if (typeof value === "string") {
      body[key] = value;
      continue;
    }

    if (!value || typeof value.arrayBuffer !== "function" || value.size === 0) {
      continue;
    }

    const buffer = Buffer.from(await value.arrayBuffer());
    const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "products" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    file = { path: uploaded.secure_url };
  }

  return { body, file };
}
