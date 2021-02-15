module.exports = function (api) {
  api.cache(true);

  const presets = ["babel-preset-expo"];
  const plugins = [];

  return {
    presets,
    plugins,
  };
};
