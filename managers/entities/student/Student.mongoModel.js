const mongoose = require("mongoose");

const StudentSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    classrooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' }],
    schoolId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'School',
        required: true
    }
});

// create model after schema creation
const StudentModel = mongoose.model("Student", StudentSchema);

// export student 
module.exports = StudentModel;