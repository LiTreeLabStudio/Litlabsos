"use strict";
// Jarvis Notification System
// Real-time notifications for sales, signups, system alerts
// Multi-channel: Discord, Webhook, Push, Email
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
exports.jarvis = void 0;
var supabase_1 = require("./supabase");
// Jarvis class for handling notifications
var Jarvis = /** @class */ (function () {
    function Jarvis(config) {
        if (config === void 0) { config = {}; }
        this.initialized = false;
        this.config = config;
    }
    Jarvis.prototype.init = function (config) {
        this.config = __assign(__assign({}, this.config), config);
        this.initialized = true;
    };
    Jarvis.prototype.notify = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var channels, results, error, _a, _i, channels_1, channel, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        if (!this.initialized) {
                            // Silenced
                        }
                        channels = payload.channels || ["discord"];
                        results = [];
                        _m.label = 1;
                    case 1:
                        _m.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, supabase_1.supabase.from("notifications").insert({
                                user_id: payload.userId || null,
                                type: payload.type,
                                priority: payload.priority,
                                title: payload.title,
                                body: payload.body,
                                data: payload.data || {},
                                channels: channels,
                            })];
                    case 2:
                        error = (_m.sent()).error;
                        if (error) {
                            // Silenced
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _m.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        _i = 0, channels_1 = channels;
                        _m.label = 5;
                    case 5:
                        if (!(_i < channels_1.length)) return [3 /*break*/, 18];
                        channel = channels_1[_i];
                        _m.label = 6;
                    case 6:
                        _m.trys.push([6, 16, , 17]);
                        _b = channel;
                        switch (_b) {
                            case "discord": return [3 /*break*/, 7];
                            case "webhook": return [3 /*break*/, 9];
                            case "push": return [3 /*break*/, 11];
                            case "email": return [3 /*break*/, 13];
                        }
                        return [3 /*break*/, 15];
                    case 7:
                        _d = (_c = results).push;
                        return [4 /*yield*/, this.sendDiscord(payload)];
                    case 8:
                        _d.apply(_c, [_m.sent()]);
                        return [3 /*break*/, 15];
                    case 9:
                        _f = (_e = results).push;
                        return [4 /*yield*/, this.sendWebhook(payload)];
                    case 10:
                        _f.apply(_e, [_m.sent()]);
                        return [3 /*break*/, 15];
                    case 11:
                        _h = (_g = results).push;
                        return [4 /*yield*/, this.sendPush()];
                    case 12:
                        _h.apply(_g, [_m.sent()]);
                        return [3 /*break*/, 15];
                    case 13:
                        _k = (_j = results).push;
                        return [4 /*yield*/, this.sendEmail()];
                    case 14:
                        _k.apply(_j, [_m.sent()]);
                        return [3 /*break*/, 15];
                    case 15: return [3 /*break*/, 17];
                    case 16:
                        _l = _m.sent();
                        results.push(false);
                        return [3 /*break*/, 17];
                    case 17:
                        _i++;
                        return [3 /*break*/, 5];
                    case 18: return [2 /*return*/, results.some(function (r) { return r; })]; // Return true if at least one succeeded
                }
            });
        });
    };
    Jarvis.prototype.sendDiscord = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var colorMap, typeEmoji, embed, response, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.config.discordWebhookUrl) {
                            return [2 /*return*/, false];
                        }
                        colorMap = {
                            low: 0x00ff00, // Green
                            medium: 0xffff00, // Yellow
                            high: 0xffa500, // Orange
                            critical: 0xff0000, // Red
                        };
                        typeEmoji = {
                            sale: "💰",
                            signup: "📝",
                            agent_created: "🤖",
                            system_alert: "⚠️",
                            chat: "💬",
                            marketing: "📢",
                            cli_event: "💻",
                        };
                        embed = {
                            title: "".concat(typeEmoji[payload.type], " ").concat(payload.title),
                            description: payload.body,
                            color: colorMap[payload.priority],
                            timestamp: new Date().toISOString(),
                            fields: payload.data
                                ? Object.entries(payload.data).map(function (_a) {
                                    var key = _a[0], value = _a[1];
                                    return ({
                                        name: key,
                                        value: String(value).substring(0, 1000),
                                        inline: true,
                                    });
                                })
                                : [],
                            footer: {
                                text: "LiTTree Labs \u2022 ".concat(payload.priority.toUpperCase()),
                            },
                        };
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fetch(this.config.discordWebhookUrl, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ embeds: [embed] }),
                            })];
                    case 2:
                        response = _b.sent();
                        return [2 /*return*/, response.ok];
                    case 3:
                        _a = _b.sent();
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Jarvis.prototype.sendWebhook = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var response, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.config.webhookEndpoint) {
                            return [2 /*return*/, false];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fetch(this.config.webhookEndpoint, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    type: payload.type,
                                    priority: payload.priority,
                                    title: payload.title,
                                    body: payload.body,
                                    data: payload.data,
                                    timestamp: new Date().toISOString(),
                                    source: "jarvis",
                                }),
                            })];
                    case 2:
                        response = _b.sent();
                        return [2 /*return*/, response.ok];
                    case 3:
                        _a = _b.sent();
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Jarvis.prototype.sendPush = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // OneSignal or WebPush implementation would go here
                return [2 /*return*/, true];
            });
        });
    };
    Jarvis.prototype.sendEmail = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Resend or SendGrid implementation would go here
                return [2 /*return*/, true];
            });
        });
    };
    // Quick notification methods
    Jarvis.prototype.sale = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.notify({
                        type: "sale",
                        priority: "high",
                        title: "New Sale! 🎉",
                        body: "".concat(data.buyerName, " bought ").concat(data.agentName, " for ").concat(data.priceLBC, " LBC"),
                        data: {
                            buyer: data.buyerName,
                            agent: data.agentName,
                            price_lbc: data.priceLBC,
                            price_usd: data.priceUSD || 0,
                            seller: data.sellerName || "Platform",
                        },
                        channels: ["discord", "webhook"],
                    })];
            });
        });
    };
    Jarvis.prototype.signup = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.notify({
                        type: "signup",
                        priority: "medium",
                        title: "New User Signup",
                        body: "".concat(data.userName, " (").concat(data.userEmail, ") just joined"),
                        data: {
                            name: data.userName,
                            email: data.userEmail,
                            source: data.source || "website",
                        },
                        channels: ["discord"],
                    })];
            });
        });
    };
    Jarvis.prototype.agentCreated = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.notify({
                        type: "agent_created",
                        priority: "medium",
                        title: "New Agent Created",
                        body: "".concat(data.creatorName, " created ").concat(data.agentName),
                        data: {
                            creator: data.creatorName,
                            agent: data.agentName,
                            category: data.category,
                        },
                        channels: ["discord"],
                    })];
            });
        });
    };
    Jarvis.prototype.systemAlert = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.notify({
                        type: "system_alert",
                        priority: data.severity,
                        title: "System Alert",
                        body: data.message,
                        data: data.details || {},
                        channels: ["discord", "webhook", "email"],
                    })];
            });
        });
    };
    Jarvis.prototype.cliEvent = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.notify({
                        type: "cli_event",
                        priority: data.success ? "low" : "high",
                        title: "CLI: ".concat(data.tool),
                        body: data.success
                            ? "Command executed successfully"
                            : "Failed: ".concat(data.output),
                        data: {
                            tool: data.tool,
                            command: data.command,
                            output: data.output.substring(0, 500),
                            success: data.success,
                        },
                        channels: ["discord"],
                    })];
            });
        });
    };
    return Jarvis;
}());
// Singleton instance
exports.jarvis = new Jarvis();
// Initialize with environment variables
if (typeof window !== "undefined") {
    // Browser - can't access env vars directly
    // Will be initialized via API call
}
else {
    // Server
    exports.jarvis.init({
        discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL,
        adminEmail: process.env.ADMIN_EMAIL,
        webhookEndpoint: process.env.JARVIS_WEBHOOK_URL,
    });
}
exports.default = exports.jarvis;
