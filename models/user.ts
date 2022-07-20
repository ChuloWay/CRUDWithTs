import { model, Schema , Document, connect } from 'mongoose';
import todo from './todo';

export interface IUser extends Document {
    user : string;
    password: string;
    todos : string[];
};


const UserSchema: Schema = new Schema<IUser>({
    user : {
        type: String,
        required: true
    },
    password: {
        type:  String,
        required: [true, 'Cannot Be Empty!']
    },
    todos : [
        {
            type: Schema.Types.ObjectId,
            ref: 'Todo'
        }
    ]
});

const User = model<IUser>('User', UserSchema);


export default User;
