"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var drizzle_orm_1 = require("drizzle-orm");
var db_1 = require("@workspace/db");
var api_zod_1 = require("@workspace/api-zod");
var slugify_1 = require("slugify");
var router = (0, express_1.Router)();
router.get("/blog", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var posts;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.db
                    .select()
                    .from(db_1.blogPostsTable)
                    .orderBy(db_1.blogPostsTable.createdAt)];
            case 1:
                posts = _a.sent();
                res.json(api_zod_1.ListBlogPostsResponse.parse(posts.map(toApiPost)));
                return [2 /*return*/];
        }
    });
}); });
router.post("/blog", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var adminToken, parsed, _a, title, body, tags, slug, wordCount, readTimeMinutes, post;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                adminToken = req.headers["x-admin-token"];
                if (!adminToken) {
                    res.status(401).json({ error: "Unauthorized" });
                    return [2 /*return*/];
                }
                parsed = api_zod_1.CreateBlogPostBody.safeParse(req.body);
                if (!parsed.success) {
                    res.status(400).json({ error: parsed.error.message });
                    return [2 /*return*/];
                }
                _a = parsed.data, title = _a.title, body = _a.body, tags = _a.tags;
                slug = (0, slugify_1.default)(title, { lower: true, strict: true }) + "-" + Date.now();
                wordCount = body.replace(/<[^>]*>/g, "").split(/\s+/).length;
                readTimeMinutes = Math.ceil(wordCount / 200);
                return [4 /*yield*/, db_1.db
                        .insert(db_1.blogPostsTable)
                        .values({ title: title, slug: slug, body: body, tags: tags, readTimeMinutes: readTimeMinutes })
                        .returning()];
            case 1:
                post = (_b.sent())[0];
                res.status(201).json(api_zod_1.GetBlogPostResponse.parse(toApiPost(post)));
                return [2 /*return*/];
        }
    });
}); });
router.get("/blog/:slug", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var params, post;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = api_zod_1.GetBlogPostParams.safeParse(req.params);
                if (!params.success) {
                    res.status(400).json({ error: params.error.message });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(db_1.blogPostsTable)
                        .where((0, drizzle_orm_1.eq)(db_1.blogPostsTable.slug, params.data.slug))];
            case 1:
                post = (_a.sent())[0];
                if (!post) {
                    res.status(404).json({ error: "Post not found" });
                    return [2 /*return*/];
                }
                res.json(api_zod_1.GetBlogPostResponse.parse(toApiPost(post)));
                return [2 /*return*/];
        }
    });
}); });
router.patch("/blog/:slug", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var adminToken, params, parsed, updates, wordCount, post;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                adminToken = req.headers["x-admin-token"];
                if (!adminToken) {
                    res.status(401).json({ error: "Unauthorized" });
                    return [2 /*return*/];
                }
                params = api_zod_1.UpdateBlogPostParams.safeParse(req.params);
                if (!params.success) {
                    res.status(400).json({ error: params.error.message });
                    return [2 /*return*/];
                }
                parsed = api_zod_1.UpdateBlogPostBody.safeParse(req.body);
                if (!parsed.success) {
                    res.status(400).json({ error: parsed.error.message });
                    return [2 /*return*/];
                }
                updates = __assign(__assign({}, parsed.data), { updatedAt: new Date() });
                if (parsed.data.body) {
                    wordCount = parsed.data.body.replace(/<[^>]*>/g, "").split(/\s+/).length;
                    updates.readTimeMinutes = Math.ceil(wordCount / 200);
                }
                return [4 /*yield*/, db_1.db
                        .update(db_1.blogPostsTable)
                        .set(updates)
                        .where((0, drizzle_orm_1.eq)(db_1.blogPostsTable.slug, params.data.slug))
                        .returning()];
            case 1:
                post = (_a.sent())[0];
                if (!post) {
                    res.status(404).json({ error: "Post not found" });
                    return [2 /*return*/];
                }
                res.json(api_zod_1.UpdateBlogPostResponse.parse(toApiPost(post)));
                return [2 /*return*/];
        }
    });
}); });
router.delete("/blog/:slug", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var adminToken, params, post;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                adminToken = req.headers["x-admin-token"];
                if (!adminToken) {
                    res.status(401).json({ error: "Unauthorized" });
                    return [2 /*return*/];
                }
                params = api_zod_1.DeleteBlogPostParams.safeParse(req.params);
                if (!params.success) {
                    res.status(400).json({ error: params.error.message });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, db_1.db
                        .delete(db_1.blogPostsTable)
                        .where((0, drizzle_orm_1.eq)(db_1.blogPostsTable.slug, params.data.slug))
                        .returning()];
            case 1:
                post = (_a.sent())[0];
                if (!post) {
                    res.status(404).json({ error: "Post not found" });
                    return [2 /*return*/];
                }
                res.sendStatus(204);
                return [2 /*return*/];
        }
    });
}); });
function toApiPost(post) {
    var _a, _b, _c, _d;
    return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        body: post.body,
        tags: (_a = post.tags) !== null && _a !== void 0 ? _a : null,
        createdAt: post.createdAt.toISOString(),
        updatedAt: (_c = (_b = post.updatedAt) === null || _b === void 0 ? void 0 : _b.toISOString()) !== null && _c !== void 0 ? _c : null,
        readTimeMinutes: (_d = post.readTimeMinutes) !== null && _d !== void 0 ? _d : null,
    };
}
exports.default = router;
