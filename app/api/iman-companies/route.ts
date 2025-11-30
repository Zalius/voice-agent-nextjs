
import { db } from "@/lib/drizzle/db";
import { companies } from "@/lib/drizzle/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get("companyId");

  if (companyId) {
    const result = await db
      .select()
      .from(companies)
      .where(eq(companies.companyId, companyId));

    return NextResponse.json(result[0] ?? null);
  }

  const all = await db.select().from(companies);
  return NextResponse.json(all);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.companyId || !body.companyName) {
      return NextResponse.json(
        { error: "companyId and companyName are required" },
        { status: 400 }
      );
    }

    const result = await db
      .insert(companies)
      .values({
        companyId: body.companyId,
        companyName: body.companyName,
      })
      .returning();

    return NextResponse.json({ success: true, data: result[0] });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { companyId, ...rest } = body;

    if (!companyId) {
      return NextResponse.json(
        { error: "companyId is required" },
        { status: 400 }
      );
    }

    const updateData: Record<string, any> = {};
    for (const key in rest) {
      if (rest[key] !== undefined) updateData[key] = rest[key];
    }

    const result = await db
      .update(companies)
      .set(updateData)
      .where(eq(companies.companyId, companyId))
      .returning();

    return NextResponse.json({ success: true, data: result[0] });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get("companyId");

  if (!companyId) {
    return NextResponse.json(
      { error: "companyId is required" },
      { status: 400 }
    );
  }

  const result = await db
    .delete(companies)
    .where(eq(companies.companyId, companyId))
    .returning();

  return NextResponse.json({ success: true, data: result[0] ?? null });
}
