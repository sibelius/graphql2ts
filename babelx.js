const config = require('./babel.config');

require = require('esm')(module, {
  mainFields: ['module'],
  force: true,
});

require('@babel/register')({
  ...config,
  extensions: ['.es6', '.es', '.jsx', '.js', '.mjs', '.ts', '.tsx'],
});

require(process.argv[2]);
