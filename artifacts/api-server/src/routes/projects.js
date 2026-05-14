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
var drizzle_orm_1 = require("drizzle-orm");
var db_1 = require("@workspace/db");
var api_zod_1 = require("@workspace/api-zod");
var bcryptjs_1 = require("bcryptjs");
var multer_1 = require("multer");
var path_1 = require("path");
var supabase_js_1 = require("@supabase/supabase-js");
var crypto_1 = require("crypto");
var router = (0, express_1.Router)();
var upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 },
});
var allowedExtensions = new Set([
    ".pdf",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
    ".mp4",
]);
var allowedMimeTypes = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "video/mp4",
]);
function getSupabaseClient() {
    var url = process.env["SUPABASE_URL"];
    var key = process.env["SUPABASE_SERVICE_ROLE_KEY"];
    if (!url || !key)
        return null;
    return (0, supabase_js_1.createClient)(url, key);
}
function sanitizeFileName(fileName) {
    var trimmed = fileName.trim();
    var safe = trimmed.replace(/[^a-zA-Z0-9._-]/g, "_");
    return safe || "upload";
}
function buildStoragePath(originalName) {
    var ext = path_1.default.extname(originalName).toLowerCase();
    var base = sanitizeFileName(path_1.default.basename(originalName, ext));
    return "projects/".concat(crypto_1.default.randomUUID(), "_").concat(base).concat(ext);
}
router.get("/projects", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var query, projects, filtered;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                query = api_zod_1.ListProjectsQueryParams.safeParse(req.query);
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(db_1.projectsTable)
                        .orderBy(db_1.projectsTable.createdAt)];
            case 1:
                projects = _a.sent();
                filtered = projects;
                if (query.success && query.data.category) {
                    filtered = projects.filter(function (p) { return p.category === query.data.category; });
                }
                res.json(api_zod_1.ListProjectsResponse.parse(filtered.map(toApiProject)));
                return [2 /*return*/];
        }
    });
}); });
router.post("/projects", upload.none(), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var adminToken, parsed, _a, title, description, category, tags, fileUrl, fileName, fileType, password, tagArray, passwordHash, isProtected, project;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                adminToken = req.headers["x-admin-token"];
                if (!adminToken) {
                    res.status(401).json({ error: "Unauthorized" });
                    return [2 /*return*/];
                }
                parsed = api_zod_1.CreateProjectBody.safeParse(req.body);
                if (!parsed.success) {
                    res.status(400).json({ error: parsed.error.message });
                    return [2 /*return*/];
                }
                _a = parsed.data, title = _a.title, description = _a.description, category = _a.category, tags = _a.tags, fileUrl = _a.fileUrl, fileName = _a.fileName, fileType = _a.fileType, password = _a.password;
                tagArray = tags
                    ? tags
                        .split(",")
                        .map(function (t) { return t.trim(); })
                        .filter(Boolean)
                    : [];
                passwordHash = null;
                isProtected = false;
                if (!password) return [3 /*break*/, 2];
                return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
            case 1:
                passwordHash = _b.sent();
                isProtected = true;
                _b.label = 2;
            case 2: return [4 /*yield*/, db_1.db
                    .insert(db_1.projectsTable)
                    .values({
                    title: title,
                    description: description !== null && description !== void 0 ? description : null,
                    category: category !== null && category !== void 0 ? category : null,
                    tags: tagArray.length ? tagArray : null,
                    fileUrl: fileUrl !== null && fileUrl !== void 0 ? fileUrl : "",
                    fileName: fileName !== null && fileName !== void 0 ? fileName : null,
                    fileType: fileType !== null && fileType !== void 0 ? fileType : null,
                    isProtected: isProtected,
                    passwordHash: passwordHash,
                })
                    .returning()];
            case 3:
                project = (_b.sent())[0];
                res.status(201).json(toApiProject(project));
                return [2 /*return*/];
        }
    });
}); });
router.post("/projects/upload", upload.single("file"), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var adminToken, file, ext, bucket, supabase, storagePath, error, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                adminToken = req.headers["x-admin-token"];
                if (!adminToken) {
                    res.status(401).json({ error: "Unauthorized" });
                    return [2 /*return*/];
                }
                file = req.file;
                if (!file) {
                    res.status(400).json({ error: "File is required" });
                    return [2 /*return*/];
                }
                ext = path_1.default.extname(file.originalname).toLowerCase();
                if (!allowedExtensions.has(ext)) {
                    res.status(400).json({ error: "Unsupported file type" });
                    return [2 /*return*/];
                }
                if (!allowedMimeTypes.has(file.mimetype)) {
                    res.status(400).json({ error: "Unsupported file type" });
                    return [2 /*return*/];
                }
                bucket = process.env["SUPABASE_BUCKET"];
                supabase = getSupabaseClient();
                if (!bucket || !supabase) {
                    res.status(500).json({ error: "Supabase not configured" });
                    return [2 /*return*/];
                }
                storagePath = buildStoragePath(file.originalname);
                return [4 /*yield*/, supabase.storage
                        .from(bucket)
                        .upload(storagePath, file.buffer, {
                        contentType: file.mimetype,
                        upsert: false,
                    })];
            case 1:
                error = (_a.sent()).error;
                if (error) {
                    res.status(500).json({ error: "Upload failed" });
                    return [2 /*return*/];
                }
                data = supabase.storage.from(bucket).getPublicUrl(storagePath).data;
                if (!(data === null || data === void 0 ? void 0 : data.publicUrl)) {
                    res.status(500).json({ error: "Failed to resolve file URL" });
                    return [2 /*return*/];
                }
                res.json({
                    fileUrl: data.publicUrl,
                    fileName: file.originalname,
                    fileType: ext.replace(".", ""),
                });
                return [2 /*return*/];
        }
    });
}); });
router.use(function (err, _req, res, next) {
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            res.status(400).json({ error: "File exceeds 100 MB limit" });
            return;
        }
        res.status(400).json({ error: "Upload failed" });
        return;
    }
    if (err) {
        console.error("Upload error caught by handler:", err);
        res.status(500).json({ error: "Unexpected upload error: ".concat(err instanceof Error ? err.message : String(err)) });
        return;
    }
    next();
});
router.delete("/projects/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var adminToken, params, project;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                adminToken = req.headers["x-admin-token"];
                if (!adminToken) {
                    res.status(401).json({ error: "Unauthorized" });
                    return [2 /*return*/];
                }
                params = api_zod_1.DeleteProjectParams.safeParse(req.params);
                if (!params.success) {
                    res.status(400).json({ error: params.error.message });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, db_1.db
                        .delete(db_1.projectsTable)
                        .where((0, drizzle_orm_1.eq)(db_1.projectsTable.id, params.data.id))
                        .returning()];
            case 1:
                project = (_a.sent())[0];
                if (!project) {
                    res.status(404).json({ error: "Project not found" });
                    return [2 /*return*/];
                }
                res.sendStatus(204);
                return [2 /*return*/];
        }
    });
}); });
router.post("/projects/:id/verify-password", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var params, parsed, project, valid;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                params = api_zod_1.VerifyProjectPasswordParams.safeParse(req.params);
                if (!params.success) {
                    res.status(400).json({ error: params.error.message });
                    return [2 /*return*/];
                }
                parsed = api_zod_1.VerifyProjectPasswordBody.safeParse(req.body);
                if (!parsed.success) {
                    res.status(400).json({ error: parsed.error.message });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, db_1.db
                        .select()
                        .from(db_1.projectsTable)
                        .where((0, drizzle_orm_1.eq)(db_1.projectsTable.id, params.data.id))];
            case 1:
                project = (_a.sent())[0];
                if (!project) {
                    res.status(404).json({ error: "Project not found" });
                    return [2 /*return*/];
                }
                if (!project.passwordHash) {
                    res.json(api_zod_1.VerifyProjectPasswordResponse.parse({ valid: true }));
                    return [2 /*return*/];
                }
                return [4 /*yield*/, bcryptjs_1.default.compare(parsed.data.password, project.passwordHash)];
            case 2:
                valid = _a.sent();
                res.json(api_zod_1.VerifyProjectPasswordResponse.parse({ valid: valid }));
                return [2 /*return*/];
        }
    });
}); });
function toApiProject(project) {
    var _a, _b, _c, _d, _e, _f;
    return {
        id: project.id,
        title: project.title,
        description: (_a = project.description) !== null && _a !== void 0 ? _a : null,
        category: (_b = project.category) !== null && _b !== void 0 ? _b : null,
        tags: (_c = project.tags) !== null && _c !== void 0 ? _c : null,
        fileUrl: project.fileUrl,
        fileName: (_d = project.fileName) !== null && _d !== void 0 ? _d : null,
        fileType: (_e = project.fileType) !== null && _e !== void 0 ? _e : null,
        isProtected: (_f = project.isProtected) !== null && _f !== void 0 ? _f : null,
        createdAt: project.createdAt.toISOString(),
    };
}
exports.default = router;
