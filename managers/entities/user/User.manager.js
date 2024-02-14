const bcrypt = require('bcrypt');
const { password } = require('../../_common/schema.models');

module.exports = class User {

    constructor({ utils, cache, config, cortex, managers, validators, mongomodels } = {}) {
        this.config = config;
        this.cortex = cortex;
        this.validators = validators;
        this.mongomodel = mongomodels["User"];
        this.tokenManager = managers.token;
        // this.usersCollection = "users";
        this.userExposed = ['createUser'];
        this.httpExposed = ['createUser', 'get=find', "login", "delete=deleteById", "delete=delete"];
    }

    async createUser(user) {
        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(user.password, saltRounds)
        try {
            let createdUser = await this.mongomodel.create({ ...user, password: hashPassword })
            console.log("🚀 ~ User ~ createUser ~ createdUser:", createdUser)

            const longToken = this.tokenManager.genLongToken({
                userId: createdUser._id, data: {
                    role: createdUser.role,
                    schoolId: createdUser.schoolId
                }
            });
            // const shortToken = this.tokenManager.genShortToken({
            //     userId: createdUser._id, data: {
            //         role: createdUser.role,
            //         schoolId: createdUser.school
            //     }
            // })

            // Response
            return {
                user: { _id: createdUser._id },
                longToken,
                // shortToken
            };
        } catch (error) {
            // const errorCodes = ["11000"]
            return checkErrors(error)
        }



    }

    async find() {
        return await this.mongomodel.find();
    }
    async login({ email, password }) {
        const user = await this.mongomodel.findOne({ email }).select("+password")//.exec()//

        if (!user) return { error: "Invalid Credentials" }
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) return { error: "Invalid Credentials" }

        const longToken = this.tokenManager.genLongToken({
            userId: user._id,
            data: {
                role: user.role,
                schoolId: user.schoolId
            }
        });
        return {
            user: {
                _id: user._id,
            },
            longToken,
            // shortToken
        };
    }
    async deleteById(id) {
        return await this.mongomodel.findByIdAndDelete(id)
    }
    async delete() {
        return await this.mongomodel.deleteMany()
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