import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import path from "path";
import methodOverride from "method-override";
import { model, Schema, Document, connect } from "mongoose";
import User from "./models/user";
import Todo from "./models/todo";
import session, { Cookie } from "express-session";
dotenv.config();

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
}

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

const sessionConfig = {
  secret: "tsdemo",
  resave: false,
  saveUninitialized: false,
};

app.use(session(sessionConfig));

const requireLogin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  next();
};

// const admin =  async(req:Request, res:Response, next:NextFunction)=>{
//   const owner = await User.findOne({id:req.session.user_id})
//   if(owner){
//     console.log("owner :", owner)
//     if(owner.isAdmin ){
//       next();
//     };
//     res.redirect("/login");
//   }
//   res.redirect("/register")
// }

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

// const admin2 = function hasRole(roles: string | string[]) {
//   return async function (req: Request, res: Response, next: NextFunction) {
//     const user = await User.findOne({ where: { id: req.session.user_id } });
//     if (user) {
//       console.log("user:", user)
//       if (user.role === "admin") {

//         next();
//       }
//     } else {
//     res.redirect("/login")
//     console.log("wrong stufff")
//     }
//   };
// };

app.get("/", (req: Request, res: Response) => {
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
