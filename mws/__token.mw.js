const roles = require('../static_arch/roles')

module.exports = ({ meta, config, managers }) => {
    return async ({ req, res, next }) => {
        let moduleName = req.params.moduleName;
        let fnName = req.params.fnName;

        if (fnName === 'login') {

            const result = await managers.user.login(req.body)
            if (result.error) return managers.responseDispatcher.dispatch(res, { ok: false, message: result.error })

            return managers.responseDispatcher.dispatch(res, {
                ok: true, data: result
            });
        }

        if (fnName === 'v1_createShortToken') {
            return next()
        }



        if (!req.headers.token) {
            console.log('token required but not found')
            return managers.responseDispatcher.dispatch(res, { ok: false, code: 401, errors: 'unauthorized' });
        }
        let decoded = null
        try {
            decoded = managers.token.verifyShortToken({ token: req.headers.token });
            if (!decoded) {
                console.log('failed to decode-1')
                return managers.responseDispatcher.dispatch(res, { ok: false, code: 401, errors: 'unauthorized' });
            };
            req.decoded = decoded;
            console.log("🚀 ~ __token ~ decoded:", decoded)
            const { role } = req.decoded.data;
            if (role === "schoolAdmin") {
                req.body.schoolId = decoded.data.schoolId;
            }
            const module = roles[role][moduleName]

            if (!module || !module[fnName]) {
                return managers.responseDispatcher.dispatch(res, { ok: false, code: 403, errors: 'forbidden', message: `${role} can not ${fnName} ${moduleName}` });
            }


        } catch (err) {
            console.log("🚀 ~ __token ~ err:", err)
            console.log('failed to decode-2')
            return managers.responseDispatcher.dispatch(res, { ok: false, code: 401, errors: 'unauthorized' });
        }

        next(decoded);
    }
}