const MiddlewaresLoader = require('./MiddlewaresLoader');
const ValidatorsLoader = require('./ValidatorsLoader');
const ResourceMeshLoader = require('./ResourceMeshLoader');
const ApiHandler = require("../managers/api/Api.manager");
// const LiveDB = require('../managers/live_db/LiveDb.manager');
const UserServer = require('../managers/http/UserServer.manager');
const ResponseDispatcher = require('../managers/response_dispatcher/ResponseDispatcher.manager');
const VirtualStack = require('../managers/virtual_stack/VirtualStack.manager');
const utils = require('../libs/utils');

const systemArch = require('../static_arch/main.system');
const TokenManager = require('../managers/token/Token.manager');
const SharkFin = require('../managers/shark_fin/SharkFin.manager');
const TimeMachine = require('../managers/time_machine/TimeMachine.manager');
const MongoLoader = require('./MongoLoader');
const User = require('../managers/entities/user/User.manager');
const StudentManager = require('../managers/entities/student/Student.manager');
const SchoolManager = require('../managers/entities/school/School.manager');
const ClassroomManager = require('../managers/entities/classroom/Classroom.manager');

/** 
 * load sharable modules
 * @return modules tree with instance of each module
*/
module.exports = class ManagersLoader {
    constructor({ config, cortex, cache, oyster, aeon }) {

        this.managers = {};
        this.config = config;
        this.cache = cache;
        this.cortex = cortex;

        this._preload();
        this.injectable = {
            utils,
            cache,
            config,
            cortex,
            oyster,
            aeon,
            managers: this.managers,
            validators: this.validators,
            mongomodels: this.mongomodels,
            resourceNodes: this.resourceNodes,
        };

    }

    // Sets this.validators, this.resourceNodes
    _preload() {
        const validatorsLoader = new ValidatorsLoader({
            models: require('../managers/_common/schema.models'),
            customValidators: require('../managers/_common/schema.validators'),
        });
        const resourceMeshLoader = new ResourceMeshLoader({})
        const mongoLoader = new MongoLoader({ schemaExtension: "mongoModel.js" });
        // const mongoLoader = new MongoLoader({ schemaExtension: "schema.js" });

        this.validators = validatorsLoader.load();
        this.resourceNodes = resourceMeshLoader.load();
        this.mongomodels = mongoLoader.load();
    }
    addEntities() {

        this.managers.student = new StudentManager(this.injectable);
        this.managers.school = new SchoolManager(this.injectable);
        this.managers.classroom = new ClassroomManager(this.injectable);
        this.managers.user = new User(this.injectable);
    }

    load() {
        this.managers.responseDispatcher = new ResponseDispatcher();
        // this.managers.liveDb = new LiveDB(this.injectable);
        const middlewaresLoader = new MiddlewaresLoader(this.injectable);
        this.injectable.mwsRepo = middlewaresLoader.load();
        /*****************************************CUSTOM MANAGERS*****************************************/
        const { layers, actions } = systemArch;
        this.managers.shark = new SharkFin({ ...this.injectable, layers, actions });
        this.managers.timeMachine = new TimeMachine(this.injectable);
        this.managers.token = new TokenManager(this.injectable);
        /*************************************************************************************************/
        this.addEntities()
        /*************************************************************************************************/
        this.managers.mwsExec = new VirtualStack({
            ...{
                preStack: [
                    '__token',
                    '__device',]
            }, ...this.injectable
        });
        this.managers.userApi = new ApiHandler({ ...this.injectable, ...{ prop: 'httpExposed' } });
        this.managers.userServer = new UserServer({ config: this.config, managers: this.managers });


        return this.managers;

    }

}

