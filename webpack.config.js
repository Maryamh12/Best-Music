const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js', // Change the entry file path accordingly
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
};