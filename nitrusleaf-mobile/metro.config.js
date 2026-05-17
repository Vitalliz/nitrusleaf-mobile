// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.transformer.babelTransformerPath = require.resolve(
  "react-native-svg-transformer"
);
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg"
);
config.resolver.sourceExts.push("svg");

config.resolver.assetExts.push("wasm");
config.resolver.sourceExts = config.resolver.sourceExts.filter(
  (ext) => ext !== "wasm"
);

module.exports = config;
