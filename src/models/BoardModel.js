"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = void 0;
const mongoose_1 = require("mongoose");
const boardSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    mainProjectId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'MainProject' },
    columnIds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Column' }],
});
exports.Board = (0, mongoose_1.model)('Board', boardSchema);
