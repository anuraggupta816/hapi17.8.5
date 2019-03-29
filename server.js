
'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Mongoose = require('mongoose');
const Pack = require('./package');
//const Plugins = require('./Plugins');
const Routes = require('./Routes');
const UniversalFunctions = require('./Utils/UniversalFunctions');
const Bootstrap = require('./Utils/BootStrap');
(async () => {
    const server = await new Hapi.Server({
        host: 'localhost',
        port: 3000,
        routes: {cors: true}
    });
    
    const swaggerOptions = {
        info: {
                title: 'Food Runner API Documentation',
                version: Pack.version,
            },
        };
    
    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        },
        //require('hapi-auth-basic')
    ]);
    // await server.register(require('hapi-auth-basic'));
    // server.auth.strategy('CustomerAuth', 'basic', { validate });
    // server.auth.strategy('Driver', 'basic', { validate });
    // server.auth.default('CustomerAuth');
    try {
        await server.start();
        console.log('Server running at:', server.info.uri);
    } catch(err) {
        console.log(err);
    }
     server.route({
        method: 'GET',
        path: '/',
        handler: function (request, h) {
 
            return 'welcome';
        }
    });
    
    server.route(Routes);
    Mongoose.connect('mongodb://localhost/foodrunner');
})();
