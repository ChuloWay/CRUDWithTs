import { model, Schema , Document, connect } from 'mongoose';



export interface ITodo extends Document {
    todo : string;
}



const TodoSchema: Schema = new Schema<ITodo>({
    todo : {
        type: String,
        required: true
    },
    
})

const Todo = model<ITodo>('Todo', TodoSchema);
export default Todo;
