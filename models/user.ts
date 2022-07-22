import { model, Schema , Model, Document, connect } from 'mongoose';
import todo from './todo';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    user : string;
    password: string;
    todos : string[];
};

interface IUserModel extends Model<IUser>{
    // will still modify to get correct return value type
    findAndValidate(user: any , password: any): any
}


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

UserSchema.statics.findAndValidate = async function(user, password){
     const foundUser:any = await this.findOne({user});
     const isValid = await bcrypt.compare(password, foundUser.password);
     return isValid ? foundUser : false
};

UserSchema.pre('save', async function(next:any){
    if(!this.isModified('password'))
    return next();
    this.password = await bcrypt.hash(this.password, 12)
    next();
})

const User = model<IUser, IUserModel>('User', UserSchema);


export default User;
