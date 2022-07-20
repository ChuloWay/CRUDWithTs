"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const method_override_1 = __importDefault(require("method-override"));
const mongoose_1 = require("mongoose");
const user_1 = __importDefault(require("./models/user"));
const todo_1 = __importDefault(require("./models/todo"));
const console_1 = require("console");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
async function run() {
    await (0, mongoose_1.connect)("mongodb://localhost:27017/ts-demo");
}
run().catch((err) => console.log(err));
// const trial = async() => {
//     const test = new User({
//         user : 'Frank'
//     })
//     await test.save();
// }
// trial();
// const trial2 = async() => {
//     const test2 = new User({
//         user : 'Paul'
//     })
//     await test2.save();
// }
// trial2();
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use((0, method_override_1.default)("_method"));
app.use(express_1.default.urlencoded({ extended: true }));
// let List: any[] = [{
// }];
// let id: number = 0
// will add mongo as db
app.get("/register", (req, res) => {
    res.render("register");
});
app.post("/register", async (req, res) => {
    const { user, password } = req.body;
    const register = new user_1.default({
        user,
        password
    });
    await register.save();
    res.redirect("/");
});
app.get("/user", async (req, res) => {
    const users = await user_1.default.findOne({ name: "Victor" })
        .populate("todos");
    console.log(users);
    res.render("user", { users });
});
app.get("/", (req, res) => {
    res.render("index");
});
app.post("/", async (req, res) => {
    const { todo } = req.body;
    const newTodo = new todo_1.default({
        todo
    });
    newTodo.save();
    const userTask = await user_1.default.findOne({ name: "Victor" });
    if (userTask) {
        userTask.todos.push(newTodo);
        userTask.save();
    }
    res.redirect("/todo");
});
app.get("/todo", async (req, res) => {
    const data = await todo_1.default.find();
    res.render("todo", { data });
});
app.get("/todo/:id", async (req, res) => {
    const { id } = req.params;
    const result = await todo_1.default.findById(id);
    res.render("show", { result });
});
app.get("/todo/:id/edit", async (req, res) => {
    const { id } = req.params;
    const result = await todo_1.default.findById(id);
    res.render("edit", { result });
});
app.patch("/todo/:id/edit", async (req, res) => {
    const { id } = req.params;
    const { user, todo } = req.body;
    console.log(user, todo);
    const fetch = await todo_1.default.findByIdAndUpdate(id, { user, todo });
    if (fetch) {
        await fetch.save();
        console.log(fetch);
    }
    res.redirect("/todo/:id");
});
app.delete("/todo/:id", async (req, res) => {
    const { id } = req.params;
    await todo_1.default.findByIdAndDelete(id);
    res.redirect("/todo");
});
// app.patch("/todo/:id/edit", async(req: Request, res: Response) => {
//     const { id } = req.params;
//     return User.findById(id)
//     .then((user) => {
//         if(user){
//             user.set(req.body.todo)
//             return user
//                 .save()
//                 .then((user)=> res.status(200).json({user}))
//                 .catch((error)=> res.status(400).json({ error }))
//         }
//         else{
//             res.status(404).json({ message: 'Not Found'})
//         }
//     })
//     .catch((error)=>{
//         res.status(500).json({error})
//     })
//     res.redirect("/todo");
// });
app.listen(port, () => {
    console.log(`Started Server On port ${port}`);
});
if (the)
    content;
brief;
was;
not;
given;
and;
you;
have;
an;
article;
to;
write..at;
the;
how;
many;
words;
do
    u;
while (have);
to;
write;
that;
is;
acceptable.
;
1500;
words--;
kind;
of;
value / quality;
over;
quantity;
google;
technical;
writing;
console_1.countReset;
developers.google.com / tech - writing;
contentre;
