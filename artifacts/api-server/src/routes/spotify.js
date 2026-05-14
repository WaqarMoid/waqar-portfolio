"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var node_fetch_1 = require("node-fetch");
var api_zod_1 = require("@workspace/api-zod");
var logger_1 = require("../lib/logger");
var router = (0, express_1.Router)();
var cachedToken = null;
var tokenExpiry = 0;
function getAccessToken() {
    return __awaiter(this, void 0, void 0, function () {
        var clientId, clientSecret, refreshToken, creds, res, data, err_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (cachedToken && Date.now() < tokenExpiry)
                        return [2 /*return*/, cachedToken];
                    clientId = process.env["SPOTIFY_CLIENT_ID"];
                    clientSecret = process.env["SPOTIFY_CLIENT_SECRET"];
                    refreshToken = process.env["SPOTIFY_REFRESH_TOKEN"];
                    if (!clientId || !clientSecret || !refreshToken) {
                        return [2 /*return*/, null];
                    }
                    creds = Buffer.from("".concat(clientId, ":").concat(clientSecret)).toString("base64");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, node_fetch_1.default)("https://accounts.spotify.com/api/token", {
                            method: "POST",
                            headers: {
                                Authorization: "Basic ".concat(creds),
                                "Content-Type": "application/x-www-form-urlencoded",
                            },
                            body: "grant_type=refresh_token&refresh_token=".concat(refreshToken),
                        })];
                case 2:
                    res = _b.sent();
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = (_b.sent());
                    if (!data.access_token)
                        return [2 /*return*/, null];
                    cachedToken = data.access_token;
                    tokenExpiry = Date.now() + (((_a = data.expires_in) !== null && _a !== void 0 ? _a : 3600) - 60) * 1000;
                    return [2 /*return*/, cachedToken];
                case 4:
                    err_1 = _b.sent();
                    logger_1.logger.warn({ err: err_1 }, "Spotify token refresh failed");
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
router.get("/now-playing", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, r, data, err_2;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    return __generator(this, function (_t) {
        switch (_t.label) {
            case 0:
                _t.trys.push([0, 4, , 5]);
                return [4 /*yield*/, getAccessToken()];
            case 1:
                token = _t.sent();
                if (!token) {
                    res.json(api_zod_1.GetSpotifyNowPlayingResponse.parse({ isPlaying: false }));
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, node_fetch_1.default)("https://api.spotify.com/v1/me/player/currently-playing", { headers: { Authorization: "Bearer ".concat(token) } })];
            case 2:
                r = _t.sent();
                if (r.status === 204 || r.status === 404) {
                    res.json(api_zod_1.GetSpotifyNowPlayingResponse.parse({ isPlaying: false }));
                    return [2 /*return*/];
                }
                return [4 /*yield*/, r.json()];
            case 3:
                data = (_t.sent());
                res.json(api_zod_1.GetSpotifyNowPlayingResponse.parse({
                    isPlaying: (_a = data.is_playing) !== null && _a !== void 0 ? _a : false,
                    title: (_c = (_b = data.item) === null || _b === void 0 ? void 0 : _b.name) !== null && _c !== void 0 ? _c : null,
                    artist: (_f = (_e = (_d = data.item) === null || _d === void 0 ? void 0 : _d.artists) === null || _e === void 0 ? void 0 : _e.map(function (a) { return a.name; }).join(", ")) !== null && _f !== void 0 ? _f : null,
                    album: (_j = (_h = (_g = data.item) === null || _g === void 0 ? void 0 : _g.album) === null || _h === void 0 ? void 0 : _h.name) !== null && _j !== void 0 ? _j : null,
                    albumArt: (_p = (_o = (_m = (_l = (_k = data.item) === null || _k === void 0 ? void 0 : _k.album) === null || _l === void 0 ? void 0 : _l.images) === null || _m === void 0 ? void 0 : _m[0]) === null || _o === void 0 ? void 0 : _o.url) !== null && _p !== void 0 ? _p : null,
                    link: (_s = (_r = (_q = data.item) === null || _q === void 0 ? void 0 : _q.external_urls) === null || _r === void 0 ? void 0 : _r.spotify) !== null && _s !== void 0 ? _s : null,
                }));
                return [3 /*break*/, 5];
            case 4:
                err_2 = _t.sent();
                logger_1.logger.warn({ err: err_2 }, "Spotify now-playing failed");
                res.json(api_zod_1.GetSpotifyNowPlayingResponse.parse({ isPlaying: false }));
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.get("/recent", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, r, data, tracks, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, getAccessToken()];
            case 1:
                token = _a.sent();
                if (!token) {
                    res.json([]);
                    return [2 /*return*/];
                }
                return [4 /*yield*/, (0, node_fetch_1.default)("https://api.spotify.com/v1/me/player/recently-played?limit=6", { headers: { Authorization: "Bearer ".concat(token) } })];
            case 2:
                r = _a.sent();
                return [4 /*yield*/, r.json()];
            case 3:
                data = (_a.sent());
                tracks = (data.items || []).map(function (item) {
                    var _a, _b, _c;
                    return ({
                        title: item.track.name,
                        artist: item.track.artists.map(function (a) { return a.name; }).join(", "),
                        albumArt: (_c = (_b = (_a = item.track.album.images) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.url) !== null && _c !== void 0 ? _c : null,
                        link: item.track.external_urls.spotify,
                    });
                });
                res.json(api_zod_1.GetSpotifyRecentResponse.parse(tracks));
                return [3 /*break*/, 5];
            case 4:
                err_3 = _a.sent();
                logger_1.logger.warn({ err: err_3 }, "Spotify recent failed");
                res.json([]);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
