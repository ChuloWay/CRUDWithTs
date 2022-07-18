import { model, Schema , Document, connect } from 'mongoose';


export interface IUser extends Document {
    user : string;
    todo: string;
};

const UserSchema: Schema = new Schema<IUser>({
    user : {
        type: String,
        required: true
    },
    todo : {
        type: String,
        required: true
    }
});

const User = model<IUser>('User', UserSchema);

export default User ;
