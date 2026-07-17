"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.asyncHandler = void 0;
const zod_1 = require("zod");
// Wraps async route handlers to catch errors
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncHandler = asyncHandler;
// Global error handler — must be last middleware
const errorHandler = (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_next) => {
    if (err instanceof zod_1.ZodError) {
        res.status(400).json({
            error: 'Validation failed',
            details: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
        });
        return;
    }
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    console.error('[Error]', err);
    res.status(status).json({ error: message });
};
exports.errorHandler = errorHandler;
