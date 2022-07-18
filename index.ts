import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import methodOverride from 'method-override';
import { model, Schema , Document, connect } from 'mongoose';
import User from "./models/todo";
import {IUser} from "./models/todo";

dotenv.config();
const app: Express = express();
const port = process.env.PORT;


async function run() {
    await connect('mongodb://localhost:27017/ts-demo');
}
 
run().catch(err => console.log(err));

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
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
// let List: any[] = [{  
// }];
// let id: number = 0

// will add mongo as db


app.get("/", (req: Request, res: Response) => {
  res.render("index");
});

app.post("/", (req: Request, res: Response) => {
  const {user, task } = req.body.todo;
    const Todo = new User({
        user: user, 
        todo:task
    })
    Todo.save();

  res.redirect("/todo");
});

app.get("/todo", async(req: Request, res: Response) => {
    const data = await User.find()
  res.render("todo", {data});
});

app.get("/todo/:id", async(req: Request, res: Response) => {
    const { id } = req.params;
    const result = await User.findById(id);
    res.render("show", { result })
});


app.get("/todo/:id/edit", async(req: Request, res: Response) => {
    const { id } = req.params;
    const result = await User.findById(id);
    res.render("edit", { result })
});


app.patch("/todo/:id/edit", async(req: Request, res: Response) => {
    const { id } = req.params;
    await User.findByIdAndUpdate(id, {$set: req.body.todo});
    await User.save();
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