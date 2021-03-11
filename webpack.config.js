const webpack = require("webpack");
const path = require("path");
const { merge } = require("webpack-merge");
const nodeExternals = require("webpack-node-externals");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

var dotenv = require("dotenv").config(); // read the .env file

if (dotenv.parsed == null) {
  console.log("\n\x1b[37m\x1b[41m%s\x1b[0m", "Set .env file first", "\n");
  throw new Error();
}

const serverConfig = function () {
  return {
    mode: dotenv.parsed.NODE_ENV,
    entry: "./src/server/index.ts",
    watch: dotenv.parsed.NODE_ENV === "development",
    target: "node",
    node: {
      __filename: false,
      __dirname: false,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          exclude: /node_modules/,
          options: {
            configFile: "tsconfig.server.json",
          },
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    externals: [nodeExternals()], // disable the node_modules imports
    output: {
      path: path.join(__dirname, "dist"),
      filename: "server.js",
    },
  };
};

const clientConfig = function (env) {
  return {
    mode: dotenv.parsed.NODE_ENV,
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          exclude: /node_modules/,
          options: {
            configFile: "tsconfig.client.json",
          },
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env.API_URL": JSON.stringify(dotenv.parsed.API_URL), // we use this in react app
        "process.env.APP_NAME": JSON.stringify(dotenv.parsed.APP_NAME), // we use this in react app
      }),
    ],
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".css", ".scss"],
    },
  };
};

const appConfig = function () {
  return merge(clientConfig(), {
    entry: "./src/client/app/index.tsx",
    output: {
      filename: "app.js",
      path: path.resolve(__dirname, "dist/public"),
    },
  });
};

const adminConfig = function () {
  return merge(clientConfig(), {
    entry: "./src/client/admin/index.tsx",
    performance: {
      // hints: false,
      maxEntrypointSize: 1024000, // we can increase the size for admin
      maxAssetSize: 1024000, // we can increase the size for admin
    },
    output: {
      filename: "admin.js",
      path: path.resolve(__dirname, "dist/public"),
    },
  });
};

const cssConfig = {
  mode: "production",
  // mode: dotenv.parsed.NODE_ENV,
  node: false,
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              minimize: true,
            },
          },
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: [".css", ".scss"],
  },
  plugins: [new OptimizeCSSAssetsPlugin({})],
};

const appCssConfig = {
  entry: "./src/client/app/scss/main.scss",
  plugins: [
    new MiniCssExtractPlugin({
      filename: "./public/assets/css/app.css",
    }),
  ],
};
const adminCssConfig = {
  entry: "./src/client/admin/scss/main.scss",
  plugins: [
    new MiniCssExtractPlugin({
      filename: "./public/assets/css/admin.css",
    }),
  ],
};
module.exports = [
  serverConfig,
  appConfig,
  adminConfig,
  merge(cssConfig, appCssConfig),
  merge(cssConfig, adminCssConfig),
];
