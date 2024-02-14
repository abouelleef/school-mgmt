const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: [2, 'First name can not be less than 2 characters'],
        max: 64
    },
    lastName: {
        type: String,
        required: true,
        min: [2, 'Last name can not be less than 2 characters'],
        max: 64
    },
    email: {
        type: String,
        unique: true,
        validate: {
            validator: function (v) {
                return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        },
        required: [true, 'User email required']
    },
    password: {
        type: String,
        select: false,
        required: [true, 'User password required'],
        min: [6, 'Password can not be less than 6 characters'],
        max: 64
    },
    role: {
        type: String,
        enum: ['schoolAdmin', 'superAdmin'],
        required: [true, "User role is required"]
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'School',
        required: function () {
            return this.role === "schoolAdmin";
        }
    }
});

// create model after schema creation
const UserModel = mongoose.model("User", UserSchema);

// export student 
module.exports = UserModel;