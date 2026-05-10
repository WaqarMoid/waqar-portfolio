import { Router, type IRouter } from "express";
import fetch from "node-fetch";
import {
  GetSpotifyNowPlayingResponse,
  GetSpotifyRecentResponse,
} from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getAccessToken(): Promise<string | null> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const clientId = process.env["SPOTIFY_CLIENT_ID"];
  const clientSecret = process.env["SPOTIFY_CLIENT_SECRET"];
  const refreshToken = process.env["SPOTIFY_REFRESH_TOKEN"];

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  const creds = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  try {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${creds}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
    });
    const data = (await res.json()) as {
      access_token?: string;
      expires_in?: number;
    };
    if (!data.access_token) return null;
    cachedToken = data.access_token;
    tokenExpiry = Date.now() + ((data.expires_in ?? 3600) - 60) * 1000;
    return cachedToken;
  } catch (err) {
    logger.warn({ err }, "Spotify token refresh failed");
    return null;
  }
}

router.get("/now-playing", async (req, res): Promise<void> => {
  try {
    const token = await getAccessToken();
    if (!token) {
      res.json(
        GetSpotifyNowPlayingResponse.parse({ isPlaying: false })
      );
      return;
    }
    const r = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (r.status === 204 || r.status === 404) {
      res.json(GetSpotifyNowPlayingResponse.parse({ isPlaying: false }));
      return;
    }
    const data = (await r.json()) as {
      is_playing?: boolean;
      item?: {
        name?: string;
        artists?: { name: string }[];
        album?: { name?: string; images?: { url: string }[] };
        external_urls?: { spotify?: string };
      };
    };
    res.json(
      GetSpotifyNowPlayingResponse.parse({
        isPlaying: data.is_playing ?? false,
        title: data.item?.name ?? null,
        artist: data.item?.artists?.map((a) => a.name).join(", ") ?? null,
        album: data.item?.album?.name ?? null,
        albumArt: data.item?.album?.images?.[0]?.url ?? null,
        link: data.item?.external_urls?.spotify ?? null,
      })
    );
  } catch (err) {
    logger.warn({ err }, "Spotify now-playing failed");
    res.json(GetSpotifyNowPlayingResponse.parse({ isPlaying: false }));
  }
});

router.get("/recent", async (req, res): Promise<void> => {
  try {
    const token = await getAccessToken();
    if (!token) {
      res.json([]);
      return;
    }
    const r = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=6",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = (await r.json()) as {
      items?: {
        track: {
          name: string;
          artists: { name: string }[];
          album: { images?: { url: string }[] };
          external_urls: { spotify: string };
        };
      }[];
    };
    const tracks = (data.items || []).map((item) => ({
      title: item.track.name,
      artist: item.track.artists.map((a) => a.name).join(", "),
      albumArt: item.track.album.images?.[1]?.url ?? null,
      link: item.track.external_urls.spotify,
    }));
    res.json(GetSpotifyRecentResponse.parse(tracks));
  } catch (err) {
    logger.warn({ err }, "Spotify recent failed");
    res.json([]);
  }
});

export default router;
