
process.env.NODE_PATH = require('path').resolve(__dirname, '../node_modules');
require('module').Module._initPaths();
require('./boot');
