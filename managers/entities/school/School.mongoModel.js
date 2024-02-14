const mongoose = require("mongoose");

const SchoolSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    address: {
        required: true,
        type: String
    },
    // Array of references to the Classroom schema
    classrooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' }]
});

const SchoolModel = mongoose.model('School', SchoolSchema);

module.exports = SchoolModel;