// NOTE: This file is NOT used. The project is built with Vite (see vite.config.js).
// It is kept only for reference. You can delete it safely.

const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js', // Change the entry file path accordingly
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
};