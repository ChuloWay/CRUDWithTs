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
const express_session_1 = __importDefault(require("express-session"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
async function run() {
    await (0, mongoose_1.connect)("mongodb://localhost:27017/ts-demo");
}
run().catch((err) => console.log(err));
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use((0, method_override_1.default)("_method"));
app.use(express_1.default.urlencoded({ extended: true }));
const sessionConfig = {
    secret: 'tsdemo',
    resave: false,
    saveUninitialized: false
};
app.use((0, express_session_1.default)(sessionConfig));
const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect("/login");
    }
    ;
    next();
};
app.get("/", (req, res) => {
    res.render("index");
});
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
    req.session.user_id = register._id;
    console.log(req.session);
    res.redirect("/new");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.post("/login", async (req, res) => {
    const { user, password } = req.body;
    const foundUser = await user_1.default.findAndValidate(user, password);
    if (foundUser) {
        req.session.user_id = foundUser._id;
        res.redirect("/new");
    }
    else {
        res.redirect("/login");
    }
});
app.get("/user", requireLogin, async (req, res) => {
    const users = await user_1.default.findById(req.session.user_id)
        .populate("todos");
    console.log(users);
    res.render("user", { users });
});
app.get("/new", requireLogin, (req, res) => {
    res.render("new");
});
app.post("/new", async (req, res) => {
    const { todo } = req.body;
    const newTodo = new todo_1.default({
        todo
    });
    newTodo.save();
    const userTask = await user_1.default.findById(req.session.user_id);
    if (userTask) {
        userTask.todos.push(newTodo);
        newTodo.user = userTask;
        await userTask.save();
        await newTodo.save();
        console.log(userTask);
    }
    res.redirect("/todo");
});
app.get("/todo", requireLogin, async (req, res) => {
    const data = await user_1.default.findById(req.session.user_id)
        .populate("todos");
    console.log(data);
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
