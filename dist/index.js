"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express_1.default.urlencoded({ extended: true }));
let List = [{}];
let id = 0;
app.get("/", (req, res) => {
    res.render("index", { List });
});
app.post("/", (req, res) => {
    id = id + 1;
    const { task } = req.body;
    List.push({ id, task });
    res.redirect("/todo");
});
app.get("/todo", (req, res) => {
    res.render("todo", { List });
});
app.get("/todo/:id", (req, res) => {
    res.render("show", { List });
});
app.post("/todo/:id", (req, res) => {
    List = List.filter(x => x.id == null);
    res.redirect('/');
});
app.listen(port, () => {
    console.log(`Started Server On port ${port}`);
});
