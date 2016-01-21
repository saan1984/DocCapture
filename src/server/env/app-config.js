var lodash = require('lodash'),
    path = require('path');
process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';
process.env.NODE_CONFIG_DIR = path.join(__dirname,"/config/");
module.exports = function(){
    var env = process.env.NODE_ENV,
        config = null,
        isEnvUndefined = lodash.isUndefined(env);
    if(isEnvUndefined){
        process.env.NODE_ENV = 'development';
    }
    config = require('config')
    return config;
}();