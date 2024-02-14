const mongoose = require("mongoose");

const ClassroomSchema = new mongoose.Schema({
    name: {
        required: true,
        unique: true,
        type: String
    },
    gradeLevel: {
        required: true,
        type: Number
    },
    schoolId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'School',
        required: true
    }
});


// create model after schema creation
const ClassroomModel = mongoose.model("Classroom", ClassroomSchema);

// export classroom 
module.exports = ClassroomModel;