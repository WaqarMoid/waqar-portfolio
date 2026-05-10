import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, projectsTable } from "@workspace/db";
import {
  ListProjectsQueryParams,
  ListProjectsResponse,
  CreateProjectBody,
  DeleteProjectParams,
  VerifyProjectPasswordParams,
  VerifyProjectPasswordBody,
  VerifyProjectPasswordResponse,
} from "@workspace/api-zod";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import crypto from "crypto";

const router: IRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
});

const allowedExtensions = new Set([
  ".pdf",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
  ".mp4",
]);

const allowedMimeTypes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "video/mp4",
]);

function getSupabaseClient(): SupabaseClient | null {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !key) return null;
  return createClient(url, key);
}

function sanitizeFileName(fileName: string): string {
  const trimmed = fileName.trim();
  const safe = trimmed.replace(/[^a-zA-Z0-9._-]/g, "_");
  return safe || "upload";
}

function buildStoragePath(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  const base = sanitizeFileName(path.basename(originalName, ext));
  return `projects/${crypto.randomUUID()}_${base}${ext}`;
}

router.get("/projects", async (req, res): Promise<void> => {
  const query = ListProjectsQueryParams.safeParse(req.query);
  const projects = await db
    .select()
    .from(projectsTable)
    .orderBy(projectsTable.createdAt);

  let filtered = projects;
  if (query.success && query.data.category) {
    filtered = projects.filter((p) => p.category === query.data.category);
  }

  res.json(ListProjectsResponse.parse(filtered.map(toApiProject)));
});

router.post("/projects", upload.none(), async (req, res): Promise<void> => {
  const adminToken = req.headers["x-admin-token"];
  if (!adminToken) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = CreateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { title, description, category, tags, fileUrl, fileName, fileType, password } =
    parsed.data;

  const tagArray =
    tags
      ? tags
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean)
      : [];

  let passwordHash: string | null = null;
  let isProtected = false;
  if (password) {
    passwordHash = await bcrypt.hash(password, 10);
    isProtected = true;
  }

  const [project] = await db
    .insert(projectsTable)
    .values({
      title,
      description: description ?? null,
      category: category ?? null,
      tags: tagArray.length ? tagArray : null,
      fileUrl: fileUrl ?? "",
      fileName: fileName ?? null,
      fileType: fileType ?? null,
      isProtected,
      passwordHash,
    })
    .returning();

  res.status(201).json(toApiProject(project));
});

router.post(
  "/projects/upload",
  upload.single("file"),
  async (req, res): Promise<void> => {
    const adminToken = req.headers["x-admin-token"];
    if (!adminToken) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "File is required" });
      return;
    }

    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.has(ext)) {
      res.status(400).json({ error: "Unsupported file type" });
      return;
    }

    if (!allowedMimeTypes.has(file.mimetype)) {
      res.status(400).json({ error: "Unsupported file type" });
      return;
    }

    const bucket = process.env["SUPABASE_BUCKET"];
    const supabase = getSupabaseClient();
    if (!bucket || !supabase) {
      res.status(500).json({ error: "Supabase not configured" });
      return;
    }

    const storagePath = buildStoragePath(file.originalname);
    const { error } = await supabase.storage
      .from(bucket)
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      res.status(500).json({ error: "Upload failed" });
      return;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
    if (!data?.publicUrl) {
      res.status(500).json({ error: "Failed to resolve file URL" });
      return;
    }

    res.json({
      fileUrl: data.publicUrl,
      fileName: file.originalname,
      fileType: ext.replace(".", ""),
    });
  },
);

router.use((err: unknown, _req, res, next): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({ error: "File exceeds 100 MB limit" });
      return;
    }
    res.status(400).json({ error: "Upload failed" });
    return;
  }

  if (err) {
    res.status(500).json({ error: "Unexpected upload error" });
    return;
  }

  next();
});

router.delete("/projects/:id", async (req, res): Promise<void> => {
  const adminToken = req.headers["x-admin-token"];
  if (!adminToken) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const params = DeleteProjectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [project] = await db
    .delete(projectsTable)
    .where(eq(projectsTable.id, params.data.id))
    .returning();

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  res.sendStatus(204);
});

router.post("/projects/:id/verify-password", async (req, res): Promise<void> => {
  const params = VerifyProjectPasswordParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = VerifyProjectPasswordBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [project] = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.id, params.data.id));

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  if (!project.passwordHash) {
    res.json(VerifyProjectPasswordResponse.parse({ valid: true }));
    return;
  }

  const valid = await bcrypt.compare(parsed.data.password, project.passwordHash);
  res.json(VerifyProjectPasswordResponse.parse({ valid }));
});

function toApiProject(project: typeof projectsTable.$inferSelect) {
  return {
    id: project.id,
    title: project.title,
    description: project.description ?? null,
    category: project.category ?? null,
    tags: project.tags ?? null,
    fileUrl: project.fileUrl,
    fileName: project.fileName ?? null,
    fileType: project.fileType ?? null,
    isProtected: project.isProtected ?? null,
    createdAt: project.createdAt.toISOString(),
  };
}

export default router;
