import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import blogRouter from "./blog.js";
import projectsRouter from "./projects.js";
import authRouter from "./auth.js";
import goodreadsRouter from "./goodreads.js";
import letterboxdRouter from "./letterboxd.js";
import spotifyRouter from "./spotify.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(blogRouter);
router.use(projectsRouter);
router.use("/auth", authRouter);
router.use("/goodreads", goodreadsRouter);
router.use("/letterboxd", letterboxdRouter);
router.use("/spotify", spotifyRouter);

export default router;
