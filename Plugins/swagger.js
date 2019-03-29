const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('../package');
const swaggerOptions = {
    info: {
            title: 'Test API Documentation',
            version: Pack.version,
    },
};

/*exports.register = function(server, options, next){
    server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);
    next();
}*/

exports.register = (async (server, options, next) => {
	await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

})

exports.register.attributes = {
    name: 'swagger-plugin'
}; 