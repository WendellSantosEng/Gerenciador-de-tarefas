"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainProject = void 0;
const mongoose_1 = require("mongoose");
const MainProjectSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String },
    ownerId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'User' },
    boardIds: [{ type: mongoose_1.Schema.Types.ObjectId }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
exports.MainProject = (0, mongoose_1.model)('MainProject', MainProjectSchema);
