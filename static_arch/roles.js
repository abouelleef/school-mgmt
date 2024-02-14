const superAdmin = {
    school: {
        find: "get",
        findById: "get",
        create: "post"
    },
    user: {
        find: "get",
        findById: "get",
        createUser: "post",
        update: "put",
        deleteById: "delete",
        // delete: "delete"
    }
}

const schoolAdmin = {
    school: {
        findSchool: "get",
        updateSchool: "put"
    },
    classroom: {
        findById: "get",
        findSchoolClassrooms: "get",
        create: "post",
        update: "put",
        deleteById: "delete",
    },
    student: {
        findById: "get",
        findAllSchoolStudents: "get",
        findAllByClassroomId: "post",
        create: "post",
        update: "put",
        deleteById: "delete",
        addToClassroom: "post",
        removeFromClassroom: "post"
    }
}

// (RU) school data
// (CRUD) school students
// (CRUD) school classrooms
// (R) classroom students

// login will not require authentication
module.exports = {
    superAdmin,
    schoolAdmin
};