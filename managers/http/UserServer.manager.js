const http = require('http');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Use an external store for consistency across multiple server instances.
})

module.exports = class UserServer {
    constructor({ config, managers }) {
        this.config = config;
        this.managers = managers
        this.userApi = managers.userApi;
    }

    /** for injecting middlewares */
    use(args) {
        app.use(args);
    }

    /** server configs */
    run() {
        app.set("trust proxy", 1);
        app.use(cors({ origin: '*' }));
        app.use(express.json());
        app.use(limiter);
        app.use(express.urlencoded({ extended: true }));
        app.use('/static', express.static('public'));

        /** an error handler */
        app.use((err, req, res, next) => {
            console.error(err.stack)
            res.status(500).send('Something broke!')
        });

        /** a single middleware to handle all */
        app.all('/api/:moduleName/:fnName', this.userApi.mw);

        let server = http.createServer(app);
        server.listen(this.config.dotEnv.USER_PORT, () => {
            console.log(`${(this.config.dotEnv.SERVICE_NAME).toUpperCase()} is running on port: ${this.config.dotEnv.USER_PORT}`);
        });
    }
}