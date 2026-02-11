import { NextResponse } from "next/server"
import { loadCommerceSnapshot } from "@/lib/convex-http"

export async function GET() {
  const snapshot = await loadCommerceSnapshot()
  return NextResponse.json(snapshot)
}
