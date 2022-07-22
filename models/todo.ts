import { model, Schema , Document, connect } from 'mongoose';



export interface ITodo extends Document {
    todo : string;
    user : any;
}



const TodoSchema: Schema = new Schema<ITodo>({
    todo : {
        type: String,
        required: true
    },
    user : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
    
})

const Todo = model<ITodo>('Todo', TodoSchema);
export default Todo;
