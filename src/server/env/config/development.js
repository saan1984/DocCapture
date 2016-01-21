//DEVELOPMENT:Configuration for each page present in the application
var config= {
   //Header and API key
    HEADERS: {
        'content-type':'application/json',
        Accept: "*/*"
    },

    //Winston logging start
    LOGGER: require("../feature/logger"),
    //Winston logging.end
    EXPRESS: require("../feature/express"),
};
module.exports = config;