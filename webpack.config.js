const path = require('path');

module.exports = {
  mode: 'development', // Set mode to development
  entry: './src/index.js', // Entry point of your application
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.js', // Output filename
    library: 'MyReactWidget', // Name your library for external usage
    libraryTarget: 'umd', // Universal Module Definition
    umdNamedDefine: true,
    libraryExport: 'default', // Export the default export
    publicPath: '/dist/', // Public URL path where the output files are served
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Use Babel for transpiling JSX and ES6+
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'] // Use style and css loaders for CSS files
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  }
};
