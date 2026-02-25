// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Tratar .wasm como asset (arquivo binário)
config.resolver.assetExts.push("wasm");

// Garantir que não vai tentar tratar wasm como source
config.resolver.sourceExts = config.resolver.sourceExts.filter(
  (ext) => ext !== "wasm"
);

module.exports = config;