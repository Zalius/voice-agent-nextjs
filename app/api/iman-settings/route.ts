import { db } from "@/lib/drizzle/db";
import { interviewSettings } from "@/lib/drizzle/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    const settings = await db.select().from(interviewSettings).limit(1)
    return NextResponse.json(settings)
}

export async function PATCH(req: Request) {
    try {
      const body = await req.json();

      console.log({body})
  
      const updateData: Record<string, any> = {};
      for (const key in body) {
        if (body[key] !== undefined) updateData[key] = body[key];
      }
  
      const result = await db
        .update(interviewSettings)
        .set(updateData)
        .where(eq(interviewSettings.id, 1))
        .returning();
  
      return Response.json({ success: true, data: result });
    } catch (err: any) {
      console.error(err);
      return Response.json(
        { error: "Internal server error", details: err.message },
        { status: 500 }
      );
    }
  }