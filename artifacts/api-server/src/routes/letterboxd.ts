import { Router, type IRouter } from "express";
import fetch from "node-fetch";
import { parseStringPromise } from "xml2js";
import { GetLetterboxdFilmsResponse } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.get("/", async (req, res): Promise<void> => {
  const username = process.env["LETTERBOXD_USERNAME"] || "fLdzD";
  const rssUrl = `https://letterboxd.com/${username}/rss/`;

  try {
    const response = await fetch(rssUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (portfolio site)" },
      redirect: "follow",
    } as Parameters<typeof fetch>[1]);
    const xml = await response.text();
    const parsed = await parseStringPromise(xml);
    const items: unknown[] = parsed?.rss?.channel?.[0]?.item || [];
    const films = (items as Record<string, unknown[]>[])
      .slice(0, 8)
      .map((item) => {
        const desc = (item["description"]?.[0] as string) || "";
        const imgMatch = desc.match(/<img[^>]+src="([^"]+)"/);
        const poster = imgMatch ? imgMatch[1] : null;
        const rating =
          (item["letterboxd:memberRating"]?.[0] as string) || null;
        return {
          title:
            (item["letterboxd:filmTitle"]?.[0] as string) ||
            (item["title"]?.[0] as string) ||
            "",
          year: (item["letterboxd:filmYear"]?.[0] as string) || null,
          poster,
          rating,
          link: (item["link"]?.[0] as string) || "",
        };
      });
    res.json(GetLetterboxdFilmsResponse.parse(films));
  } catch (err) {
    logger.warn({ err }, "Letterboxd fetch failed");
    res.json([]);
  }
});

export default router;
