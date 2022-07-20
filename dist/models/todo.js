"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TodoSchema = new mongoose_1.Schema({
    todo: {
        type: String,
        required: true
    },
});
const Todo = (0, mongoose_1.model)('Todo', TodoSchema);
exports.default = Todo;
