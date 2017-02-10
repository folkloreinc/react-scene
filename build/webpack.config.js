const path = require('path');

module.exports = (env) => {
    const configPath = path.join(__dirname, `./webpack.config.${env}.js`);
    return require(configPath)(env);
};
