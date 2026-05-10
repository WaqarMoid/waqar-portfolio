import { Router, type IRouter } from "express";
import healthRouter from "./health";
import blogRouter from "./blog";
import projectsRouter from "./projects";
import authRouter from "./auth";
import goodreadsRouter from "./goodreads";
import letterboxdRouter from "./letterboxd";
import spotifyRouter from "./spotify";

const router: IRouter = Router();

router.use(healthRouter);
router.use(blogRouter);
router.use(projectsRouter);
router.use("/auth", authRouter);
router.use("/goodreads", goodreadsRouter);
router.use("/letterboxd", letterboxdRouter);
router.use("/spotify", spotifyRouter);

export default router;
