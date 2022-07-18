"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
;
const UserSchema = new mongoose_1.Schema({
    user: {
        type: String,
        required: true
    },
    todo: {
        type: String,
        required: true
    }
});
const User = (0, mongoose_1.model)('User', UserSchema);
exports.default = User;