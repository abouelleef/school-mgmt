

module.exports = class StudentManager {

    /**
     * Represents a Repository of a model.
     * @constructor
     * @param {object} containing instance of Injectable
     * @param {string} modelName Model Name
     */
    constructor({ validators, mongomodels } = {}, modelName = "Student") {
        this.validators = validators
        this.mongomodel = mongomodels[modelName];
        this.modelName = modelName
        this.httpExposed = ['post=create', 'get=findById', 'put=update', 'delete=deleteById',
            'get=findAllSchoolStudents', 'post=findAllByClassroomId',
            'post=addToClassroom', 'post=removeFromClassroom'
        ];
    }

    async create(student) {

        try {
            return await this.mongomodel.create(student)
        } catch (error) {
            return checkErrors(error)
        }
    }
    async update({ _id, firstName,
        lastName,
        dob,
        classrooms,
        schoolId
    }) {


        try {
            const s = await this.findById({ _id })
            if (s.error) return s


            return await this.mongomodel.updateOne({ _id }, {
                firstName,
                lastName,
                dob,
                classrooms,
                schoolId
            })
        } catch (error) {
            return checkErrors(error)
        }
    }
    async deleteById({ _id }) {
        const s = await this.findById({ _id })
        if (s.error) return s
        try {
            return await this.mongomodel.deleteOne({ _id })
        } catch (error) {
            return checkErrors(error)
        }
    }
    async findAllSchoolStudents({ schoolId }) {
        try {
            return await this.mongomodel.find({ schoolId })
        } catch (error) {
            return checkErrors(error)
        }
    }
    async findAllByClassroomId({ classroomId }) {
        try {
            return await this.mongomodel.find({ classrooms: [classroomId] })
        } catch (error) {
            return checkErrors(error)
        }
    }
    async addToClassroom({ _id, classroomId }) {
        try {
            return await this.mongomodel.updateOne({ _id }, { $push: { classrooms: classroomId } })
        } catch (error) {
            return checkErrors(error)
        }

    }
    async removeFromClassroom({ _id, classroomId }) {
        try {
            return await this.mongomodel.updateOne({ _id }, { $pull: { classrooms: classroomId } })
        } catch (error) {
            return checkErrors(error)
        }

    }

    async findById({ _id }) {
        if (!_id) return { error: "Student not found" }
        try {
            const s = await this.mongomodel.findById(_id)
            if (!s) return { error: "Student not found" }
            return s
        } catch (error) {
            return checkErrors(error)
        }
    }
}


function checkErrors(error) {
    console.error("🚀 ~ checkErrors ~ error:", error)
    if (error.code == 11000) {
        const errors = {
            name: "ValidatorError",
            message: `Duplicated Key`,
            key: error.keyValue
        }
        return { errors }
    }
    return error
}