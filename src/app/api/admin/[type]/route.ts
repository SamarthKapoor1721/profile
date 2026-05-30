import { NextResponse } from "next/server";
import {
  checkAuth,
  isReadOnly,
  isContentType,
  readContent,
  writeContent,
} from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: { type: string } };

function guard(req: Request, type: string, write: boolean) {
  if (!isContentType(type)) {
    return NextResponse.json({ error: "Unknown content type" }, { status: 404 });
  }
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (write && isReadOnly()) {
    return NextResponse.json(
      { error: "This deployment is read-only. Run the admin panel locally to edit content, then redeploy." },
      { status: 403 },
    );
  }
  return null;
}

export async function GET(req: Request, { params }: Params) {
  const blocked = guard(req, params.type, false);
  if (blocked) return blocked;
  const items = await readContent(params.type as never);
  return NextResponse.json({ items });
}

export async function POST(req: Request, { params }: Params) {
  const blocked = guard(req, params.type, true);
  if (blocked) return blocked;

  const item = await req.json().catch(() => null);
  if (!item || typeof item !== "object") {
    return NextResponse.json({ error: "Invalid item" }, { status: 400 });
  }
  const items = await readContent(params.type as never);
  items.push(item);
  await writeContent(params.type as never, items);
  return NextResponse.json({ items });
}

export async function PUT(req: Request, { params }: Params) {
  const blocked = guard(req, params.type, true);
  if (blocked) return blocked;

  const body = await req.json().catch(() => null);
  const index = body?.index;
  const item = body?.item;
  if (typeof index !== "number" || !item || typeof item !== "object") {
    return NextResponse.json({ error: "Expected { index, item }" }, { status: 400 });
  }
  const items = await readContent(params.type as never);
  if (index < 0 || index >= items.length) {
    return NextResponse.json({ error: "Index out of range" }, { status: 400 });
  }
  items[index] = item;
  await writeContent(params.type as never, items);
  return NextResponse.json({ items });
}

export async function DELETE(req: Request, { params }: Params) {
  const blocked = guard(req, params.type, true);
  if (blocked) return blocked;

  const { searchParams } = new URL(req.url);
  const index = Number(searchParams.get("index"));
  const items = await readContent(params.type as never);
  if (!Number.isInteger(index) || index < 0 || index >= items.length) {
    return NextResponse.json({ error: "Invalid index" }, { status: 400 });
  }
  items.splice(index, 1);
  await writeContent(params.type as never, items);
  return NextResponse.json({ items });
}
