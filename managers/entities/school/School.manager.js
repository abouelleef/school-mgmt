

module.exports = class SchoolManager {

    /**
     * Represents a Repository of a model.
     * @constructor
     * @param {object} containing instance of Injectable
     * @param {string} modelName Model Name
     */
    constructor({ utils, cache, config, cortex, managers, validators, mongomodels } = {}, modelName = "School") {
        this.validators = validators
        this.mongomodel = mongomodels[modelName];
        this.modelName = modelName
        this.httpExposed = ['post=create', 'get=findById', 'get=find', 'put=update', 'delete=deleteById',
            'get=findSchool',
            'put=updateSchool'
        ];
    }

    async create(instance) {

        try {
            return await this.mongomodel.create(instance)
        } catch (error) {
            // const errorCodes = ["11000"]
            return checkErrors(error)
        }
    }
    async update({ _id, name, address, classrooms }) {
        try {
            return await this.mongomodel.updateOne({ _id }, { name, address, classrooms })
        } catch (error) {
            return checkErrors(error)
        }
    }
    async updateSchool({ schoolId, name, address, classrooms }) {
        try {
            return await this.mongomodel.updateOne({ _id: schoolId }, { name, address, classrooms })
        } catch (error) {
            return checkErrors(error)
        }
    }

    async findById({ _id }) {

        return await this.mongomodel.findById({ _id })
    }

    async find() {
        return await this.mongomodel.find()
    }

    async findSchool({ schoolId }) {
        try {
            return await this.mongomodel.find({ _id: schoolId })
        } catch (error) {
            return checkErrors(error)
        }

    }

    async deleteById({ schoolId }) {
        return await this.mongomodel.findByIdAndDelete({ _id: schoolId })
    }

}

function checkErrors(error) {
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