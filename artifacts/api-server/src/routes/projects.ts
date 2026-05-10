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

const router: IRouter = Router();

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

router.post("/projects", async (req, res): Promise<void> => {
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
