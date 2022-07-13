import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";

dotenv.config();
const app: Express = express();
const port = process.env.PORT;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
let List: any[] = [{  
}];
let id: number = 0

app.get("/", (req: Request, res: Response) => {
  res.render("index", { List });
});

app.post("/", (req: Request, res: Response) => {
    id = id + 1
  const { task } = req.body;
  List.push({id,task});
  res.redirect("/todo");
});



app.get("/todo", (req: Request, res: Response) => {
  res.render("todo", { List });
});

app.get("/todo/:id", (req: Request, res: Response) => {
    res.render("show", {List});
});

app.post("/todo/:id", (req: Request, res: Response) =>{
    List = List.filter(x => x.id == null );
    res.redirect('/')
} )

app.listen(port, () => {
  console.log(`Started Server On port ${port}`);
});