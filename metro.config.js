const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ensure AsyncStorage and other native modules work properly in production builds
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add support for additional file extensions if needed
config.resolver.sourceExts.push('cjs');

// Ensure proper handling of node modules
config.resolver.nodeModulesPaths = [
  require('path').resolve(__dirname, 'node_modules'),
];

// Production optimizations
if (process.env.NODE_ENV === 'production') {
  // Enable minification for production builds
  config.transformer.minifierConfig = {
    keep_fnames: true,
    mangle: {
      keep_fnames: true,
    },
  };
}

module.exports = config;
