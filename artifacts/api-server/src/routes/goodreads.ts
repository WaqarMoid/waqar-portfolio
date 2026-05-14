import { Router, type IRouter } from "express";
import fetch from "node-fetch";
import { parseStringPromise } from "xml2js";
import { GetGoodreadsBooksResponse } from "@workspace/api-zod";
import { logger } from "../lib/logger.js";

const router: IRouter = Router();

router.get("/", async (req, res): Promise<void> => {
  const shelf = (req.query["shelf"] as string) || "currently-reading";
  const userId = process.env["GOODREADS_USER_ID"] || "170611572";
  const url = `https://www.goodreads.com/review/list_rss/${userId}?shelf=${shelf}`;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (portfolio site)" },
    });
    const xml = await response.text();
    const parsed = await parseStringPromise(xml);
    const items: unknown[] = parsed?.rss?.channel?.[0]?.item || [];
    const books = (items as Record<string, unknown[]>[])
      .slice(0, 10)
      .map((item) => ({
        title: (item["title"]?.[0] as string) || "",
        author: (item["author_name"]?.[0] as string) || "",
        cover:
          (item["book_large_image_url"]?.[0] as string) ||
          (item["book_image_url"]?.[0] as string) ||
          null,
        link: (item["link"]?.[0] as string) || "",
      }));
    res.json(GetGoodreadsBooksResponse.parse(books));
  } catch (err) {
    logger.warn({ err }, "Goodreads fetch failed");
    res.json([]);
  }
});

export default router;
