import dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response, NextFunction } from "express";
import { PORT } from "./src/utils/secrets";
import passport from "passport"
import path from "path";
import methodOverride from "method-override";
import { model, Schema, Document, connect } from "mongoose";
import User from "./models/user";
import Todo from "./models/todo";
import session, { Cookie } from "express-session";
import "./src/config/passport";

// Add Passport in other branch [ to make use of google Auth]

const app: Express = express();
const port = process.env.PORT;

async function run() {
  await connect("mongodb://localhost:27017/ts-demo");
}

run().catch((err) => console.log(err));

declare module "express-session" {
  interface SessionData {
    views: number;
    user_id: any;
  }
}

interface SessionData {
  cookie: Cookie;
};

const sessionConfig = {
  secret: "tsdemo",
  resave: false,
  saveUninitialized: false,
};

app.use(session(sessionConfig));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());




const requireLogin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  next();
};

const admin = async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findById(req.session.user_id);
  if (user) {
    console.log("user:", user);
    if (user.role === "admin") {
      next();
    }
    else{
      console.log("Not Admin")
      res.redirect("/login");
    }
  } else {
    console.log("No User");
    res.redirect("/login");
  }
};


app.get("/", (req: Request, res: Response) => {
  console.log(req.user);
  res.render("index");
});

app.get("/register", (req: Request, res: Response) => {
  res.render("register");
});

app.post("/register", async (req: Request, res: Response) => {
  const { user, password, role } = req.body;
  console.log(req.body);
  const register = new User({
    user,
    password,
    role,
  });
  await register.save();
  req.session.user_id = register._id;
  console.log(req.session);
  res.redirect("/new");
});

app.get("/login", (req: Request, res: Response) => {
  res.render("login");
});

app.post("/login", async (req: Request, res: Response) => {
  const { user, password } = req.body;
  const foundUser = await User.findAndValidate(user, password);
  if (foundUser) {
    req.session.user_id = foundUser._id;
    res.redirect("/new");
  } else {
    res.redirect("/login");
  }
});

app.get("/user", requireLogin, admin, async (req: Request, res: Response) => {
  const users = await User.find().populate("todos");
  console.log(users);
  res.render("user", { users });
});

app.get("/new", requireLogin, (req: Request, res: Response) => {
  res.render("new");
});

app.post("/new", async (req: Request, res: Response) => {
  const { todo } = req.body;
  const newTodo: any = new Todo({
    todo,
  });
  newTodo.save();
  const userTask = await User.findById(req.session.user_id);
  if (userTask) {
    userTask.todos.push(newTodo);
    newTodo.user = userTask;
    await userTask.save();
    await newTodo.save();
    console.log(userTask);
  }
  res.redirect("/todo");
});

app.get("/todo", requireLogin, async (req: Request, res: Response) => {
  const data = await User.findById(req.session.user_id).populate("todos");
  console.dir(req.user);
  res.render("todo", { data });
});

app.get("/todo/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await Todo.findById(id);
  res.render("show", { result });
});

app.get("/todo/:id/edit", async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await Todo.findById(id);
  res.render("edit", { result });
});

app.patch("/todo/:id/edit", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user, todo } = req.body;
  console.log(user, todo);
  const fetch = await Todo.findByIdAndUpdate(id, { user, todo });
  if (fetch) {
    await fetch.save();
    console.log(fetch);
  }
  res.redirect("/todo/:id");
});

app.delete("/todo/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);
  res.redirect("/todo");
});

app.get("/logout", (req: Request, res: Response)=> {
  req.session.user_id = null;
  res.redirect("/login")
})

//You can see we use passport.authenticate() which accepts 2 arguments, first one is the "strategy" we want to use i.e Google in our case, the second is an object that defines the scope. Scopes are the pieces of data that we want from the user's account. 
app.get("/google", passport.authenticate("google", {
  scope: ["email", "profile"],
})
);

app.get("/google/redirect", passport.authenticate("google", { failureRedirect: "/"})
,(req: Request, res: Response)=>{
  res.send("callback route called");
  console.log(req.user);
})

app.listen(PORT, () => {
  console.log(`Started Server On port ${PORT}`);
});
