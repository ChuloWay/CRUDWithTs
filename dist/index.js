"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const secrets_1 = require("./src/utils/secrets");
const passport_1 = __importDefault(require("passport"));
const path_1 = __importDefault(require("path"));
const method_override_1 = __importDefault(require("method-override"));
const mongoose_1 = require("mongoose");
const user_1 = __importDefault(require("./models/user"));
const todo_1 = __importDefault(require("./models/todo"));
const express_session_1 = __importDefault(require("express-session"));
require("./src/config/passport");
// Add Passport in other branch [ to make use of google Auth]
const app = (0, express_1.default)();
const port = process.env.PORT;
async function run() {
    await (0, mongoose_1.connect)("mongodb://localhost:27017/ts-demo");
}
run().catch((err) => console.log(err));
;
const sessionConfig = {
    secret: "tsdemo",
    resave: false,
    saveUninitialized: false,
};
app.use((0, express_session_1.default)(sessionConfig));
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use((0, method_override_1.default)("_method"));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
const requireLogin = (req, res, next) => {
    if (!req.user) {
        return res.redirect("/login");
    }
    next();
};
const admin = async (req, res, next) => {
    const user = await user_1.default.findById(req.session.user_id);
    if (user) {
        console.log("user:", user);
        if (user.role === "admin") {
            next();
        }
        else {
            console.log("Not Admin");
            res.redirect("/login");
        }
    }
    else {
        console.log("No User");
        res.redirect("/login");
    }
};
app.get("/", (req, res) => {
    console.log(req.user);
    res.render("index");
});
app.get("/register", (req, res) => {
    res.render("register");
});
app.post("/register", async (req, res) => {
    const { user, password, role } = req.body;
    // console.log(req.body);
    const register = new user_1.default({
        user,
        password,
        role,
    });
    await register.save();
    req.session.user_id = register._id;
    // console.log(req.session);
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
app.get("/user", requireLogin, admin, async (req, res) => {
    const users = await user_1.default.find().populate("todos");
    // console.log(users);
    res.render("user", { users });
});
app.get("/new", requireLogin, (req, res) => {
    console.log(req.session);
    res.render("new");
});
app.post("/new", async (req, res) => {
    const { todo } = req.body;
    const newTodo = new todo_1.default({
        todo,
    });
    // if(req.user){
    //   newTodo.user = req.user._id;
    // }
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
    const data = await user_1.default.findById(req.session.user_id).populate("todos");
    // console.dir(req.user);
    res.render("todo", { data });
});
app.get("/todo/:id", async (req, res) => {
    const { id } = req.params;
    const result = await todo_1.default.findById(id).populate("user");
    res.render("show", { result });
});
app.get("/todo/:id/edit", async (req, res) => {
    const { id } = req.params;
    const result = await todo_1.default.findById(id).populate("user");
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
app.get("/logout", (req, res) => {
    req.session.user_id = null;
    res.redirect("/login");
});
//You can see we use passport.authenticate() which accepts 2 arguments, first one is the "strategy" we want to use i.e Google in our case, the second is an object that defines the scope. Scopes are the pieces of data that we want from the user's account. 
app.get("/google", passport_1.default.authenticate("google", {
    scope: ["email", "profile"],
}));
app.get("/google/redirect", passport_1.default.authenticate("google", { failureRedirect: "/" }), (req, res) => {
    // res.send("callback route called");
    req.session.user_id = req.user;
    res.render("new");
    console.log("this is the user :", req.session);
});
app.listen(secrets_1.PORT, () => {
    console.log(`Started Server On port ${secrets_1.PORT}`);
});
