import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, blogPostsTable } from "@workspace/db";
import {
  ListBlogPostsResponse,
  GetBlogPostParams,
  GetBlogPostResponse,
  CreateBlogPostBody,
  UpdateBlogPostParams,
  UpdateBlogPostBody,
  UpdateBlogPostResponse,
  DeleteBlogPostParams,
} from "@workspace/api-zod";
import slugify from "slugify";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.get("/blog", async (req, res): Promise<void> => {
  const posts = await db
    .select()
    .from(blogPostsTable)
    .orderBy(blogPostsTable.createdAt);
  res.json(ListBlogPostsResponse.parse(posts.map(toApiPost)));
});

router.post("/blog", async (req, res): Promise<void> => {
  const adminToken = req.headers["x-admin-token"];
  if (!adminToken) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = CreateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { title, body, tags } = parsed.data;
  const slug =
    slugify(title, { lower: true, strict: true }) + "-" + Date.now();
  const wordCount = body.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const readTimeMinutes = Math.ceil(wordCount / 200);

  const [post] = await db
    .insert(blogPostsTable)
    .values({ title, slug, body, tags, readTimeMinutes })
    .returning();

  res.status(201).json(GetBlogPostResponse.parse(toApiPost(post)));
});

router.get("/blog/:slug", async (req, res): Promise<void> => {
  const params = GetBlogPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [post] = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.slug, params.data.slug));

  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  res.json(GetBlogPostResponse.parse(toApiPost(post)));
});

router.patch("/blog/:slug", async (req, res): Promise<void> => {
  const adminToken = req.headers["x-admin-token"];
  if (!adminToken) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const params = UpdateBlogPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updates: Record<string, unknown> = { ...parsed.data, updatedAt: new Date() };
  if (parsed.data.body) {
    const wordCount = parsed.data.body.replace(/<[^>]*>/g, "").split(/\s+/).length;
    updates.readTimeMinutes = Math.ceil(wordCount / 200);
  }

  const [post] = await db
    .update(blogPostsTable)
    .set(updates)
    .where(eq(blogPostsTable.slug, params.data.slug))
    .returning();

  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  res.json(UpdateBlogPostResponse.parse(toApiPost(post)));
});

router.delete("/blog/:slug", async (req, res): Promise<void> => {
  const adminToken = req.headers["x-admin-token"];
  if (!adminToken) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const params = DeleteBlogPostParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [post] = await db
    .delete(blogPostsTable)
    .where(eq(blogPostsTable.slug, params.data.slug))
    .returning();

  if (!post) {
    res.status(404).json({ error: "Post not found" });
    return;
  }

  res.sendStatus(204);
});

function toApiPost(post: typeof blogPostsTable.$inferSelect) {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    body: post.body,
    tags: post.tags ?? null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt?.toISOString() ?? null,
    readTimeMinutes: post.readTimeMinutes ?? null,
  };
}

export default router;
