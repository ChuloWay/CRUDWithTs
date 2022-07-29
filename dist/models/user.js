"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
;
const UserSchema = new mongoose_1.Schema({
    user: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: [true, 'Cannot Be Empty!']
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    todos: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Todo'
        }
    ]
});
UserSchema.statics.findAndValidate = async function (user, password) {
    const foundUser = await this.findOne({ user });
    if (foundUser) {
        const isValid = await bcrypt_1.default.compare(password, foundUser.password);
        return isValid ? foundUser : false;
    }
};
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    this.password = await bcrypt_1.default.hash(this.password, 12);
    next();
});
const User = (0, mongoose_1.model)('User', UserSchema);
exports.default = User;
