const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ensure AsyncStorage and other native modules work properly in production builds
config.resolver.platforms = ["ios", "android", "native", "web"];

// Add support for additional file extensions if needed
config.resolver.sourceExts.push("cjs");

// Ensure proper handling of node modules
config.resolver.nodeModulesPaths = [
  require("path").resolve(__dirname, "node_modules"),
];

// Ensure AsyncStorage is properly resolved
config.resolver.alias = {
  ...config.resolver.alias,
  "@react-native-async-storage/async-storage": require.resolve(
    "@react-native-async-storage/async-storage"
  ),
};

// Production optimizations
if (process.env.NODE_ENV === "production") {
  // Enable minification for production builds but preserve AsyncStorage functionality
  config.transformer.minifierConfig = {
    keep_fnames: true,
    mangle: {
      keep_fnames: true,
    },
    // Preserve AsyncStorage and related functionality
    reserved: ["AsyncStorage", "RNCAsyncStorage"],
  };

  // Ensure proper handling of AsyncStorage in production
  config.transformer.getTransformOptions = async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: false, // Disable to prevent AsyncStorage issues
    },
  });
}

module.exports = config;
