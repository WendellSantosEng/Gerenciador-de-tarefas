"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Column = void 0;
const mongoose_1 = require("mongoose");
const columnSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    boardId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Board' },
    taskIds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Task' }]
});
exports.Column = (0, mongoose_1.model)('Column', columnSchema);
