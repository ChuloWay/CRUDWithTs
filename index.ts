import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import methodOverride from "method-override";
import { model, Schema, Document, connect } from "mongoose";
import User from "./models/user";
import Todo from "./models/todo";
import bcrypt from "bcrypt";
import session from "express-session"
dotenv.config();



const app: Express = express();
const port = process.env.PORT;

async function run() {
  await connect("mongodb://localhost:27017/ts-demo");
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

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

const sessionConfig = {
  secret: 'tsdemo',
  resave: false,
  saveUninitialized: false
}

app.use(session(sessionConfig));

const requireLogin = (req:Request, res:Response, next:any)=>{
    if(!req.session.user_id){
      return res.redirect("/login")
    };
    next();
}



app.get("/login",(req:Request, res:Response)=>{
  res.render("login")
});


app.post("/login", async(req:Request, res:Response)=>{
  const {user,password}= req.body;
  const foundUser = await User.findAndValidate(user,password);
  if(foundUser){
    req.session.user_id = foundUser._id
    res.redirect("/")
  }
  else{
    res.redirect("/login")
  }
})

 
app.get("/register",(req:Request, res:Response)=>{
  res.render("register")
});

app.post("/register",async(req:Request, res:Response)=>{
  const {user,password} = req.body
  const register = new User({
    user,
    password
  });
  await register.save();
  res.redirect("/");
});

app.get("/user",async(req:Request, res:Response)=>{
  const users = await User.findOne({name:"Victor"})
  .populate("todos")
  console.log(users)
  res.render("user", {users})
})


app.get("/", (req: Request, res: Response) => {
  res.render("index");
});

app.post("/", async(req: Request, res: Response) => {
  const {todo} = req.body;
  const newTodo:any = new Todo({
    todo
  });
  newTodo.save();
  const userTask = await User.findOne({name:"Victor"});
  if(userTask){
    userTask.todos.push(newTodo);
    userTask.save();
  }
  res.redirect("/todo");
});




app.get("/todo", async (req: Request, res: Response) => {
  const data = await Todo.find();
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


