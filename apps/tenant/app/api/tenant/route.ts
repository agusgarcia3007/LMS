import { NextResponse } from "next/server";
import { getTenant } from "@/lib/tenant";

export async function GET() {
  const tenant = await getTenant();

  if (!tenant) {
    return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
  }

  return NextResponse.json({ tenant });
}
