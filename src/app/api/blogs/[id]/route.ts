import { NextResponse } from "next/server";
import { getBlogs } from "../../../lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blogs = await getBlogs();
    const blog = blogs.find((b) => b.id === id);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error(`GET /api/blogs/${params} error:`, error);
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}
