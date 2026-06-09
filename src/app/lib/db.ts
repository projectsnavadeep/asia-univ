import fs from "fs/promises";
import path from "path";
import { Article } from "../data";

const filePath = path.join(process.cwd(), "src/app/data/blogs.json");

export async function getBlogs(): Promise<Article[]> {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading blogs.json:", error);
    return [];
  }
}

export async function saveBlogs(blogs: Article[]): Promise<boolean> {
  try {
    await fs.writeFile(filePath, JSON.stringify(blogs, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing to blogs.json:", error);
    return false;
  }
}
