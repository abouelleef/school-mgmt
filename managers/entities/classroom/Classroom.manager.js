

module.exports = class ClassroomManager {

    /**
     * Represents a Repository of a model.
     * @constructor
     * @param {object} containing instance of Injectable
     * @param {string} modelName Model Name
     */
    constructor({ utils, cache, config, cortex, managers, validators, mongomodels } = {}, modelName = "Classroom") {
        this.validators = validators
        this.mongomodel = mongomodels[modelName];
        this.modelName = modelName
        this.httpExposed = ['post=create', 'put=update', 'get=findById', 'delete=deleteById',
            'get=findSchoolClassrooms',
        ];
    }

    async create(classroom) {
        try {
            return await this.mongomodel.create(classroom)
        } catch (error) {
            return checkErrors(error)
        }
    }
    async update({ _id, schoolId, name, gradeLevel }) {

        try {
            const result = await this.findById({ _id, schoolId })
            if (result.error) return result

            return await this.mongomodel.updateOne({ _id }, { name, gradeLevel })
        } catch (error) {
            return checkErrors(error)
        }
    }
    async deleteById({ _id, schoolId }) {

        try {
            const result = await this.findById({ _id, schoolId })
            if (result.error) return result

            return await this.mongomodel.deleteOne(classroom)
        } catch (error) {
            return checkErrors(error)
        }
    }
    async findSchoolClassrooms({ schoolId }) {
        try {
            return await this.mongomodel.find({ schoolId })
        } catch (error) {
            return checkErrors(error)
        }
    }
    async findById({ _id, schoolId }) {
        if (!_id) return { error: "Classroom not found" }
        try {
            const c = await this.mongomodel.find({ _id, schoolId })
            if (c.length === 0) return { error: "Classroom not found" }
            return c.at(0)
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