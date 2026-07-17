"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_1 = __importDefault(require("./routes/auth"));
const listings_1 = __importDefault(require("./routes/listings"));
const requests_1 = __importDefault(require("./routes/requests"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const profile_1 = __importDefault(require("./routes/profile"));
const admin_1 = __importDefault(require("./routes/admin"));
const stats_1 = __importDefault(require("./routes/stats"));
const foodRequests_1 = __importDefault(require("./routes/foodRequests"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Rate limit auth routes
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: { error: 'Too many attempts. Please try again later.' },
});
// Routes
app.use('/api/auth', authLimiter, auth_1.default);
app.use('/api/listings', listings_1.default);
app.use('/api/requests', requests_1.default);
app.use('/api/notifications', notifications_1.default);
app.use('/api/profile', profile_1.default);
app.use('/api/admin', admin_1.default);
app.use('/api/stats', stats_1.default);
app.use('/api/food-requests', foodRequests_1.default);
// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));
// Global error handler (must be last)
app.use(errorHandler_1.errorHandler);
exports.default = app;
