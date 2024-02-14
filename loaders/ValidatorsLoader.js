const loader = require('./_common/fileLoader');
const Pine = require('qantra-pineapple');

/** 
 * load any file that match the pattern of function file and require them 
 * @return an array of the required functions
*/
module.exports = class ValidatorsLoader {
    constructor({ models, customValidators } = {}) {
        this.models = models;
        this.customValidators = customValidators;
    }
    load() {

        const validators = {};

        /**
         * load schemes
         * load models ( passed to the consturctor )
         * load custom validators
         */
        const schemes = loader('./managers/**/*.schema.js');

        Object.keys(schemes).forEach(schemaKey => {

            let pine = new Pine({ models: this.models, customValidators: this.customValidators });
            validators[schemaKey] = {};


            Object.keys(schemes[schemaKey]).forEach(s => {

                validators[schemaKey][s] = async (data) => {
                    return (await pine.validate(data, schemes[schemaKey][s]));
                }

                /** also exports the trimmer function for the same */
                validators[schemaKey][`${s}Trimmer`] = async (data) => {
                    return (await pine.trim(data, schemes[schemaKey][s]));
                }
            });
        })

        return validators;
    }
}