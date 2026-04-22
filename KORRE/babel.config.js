module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Remova as linhas do worklets e do reanimated daqui.
      // O babel-preset-expo já lida com eles nas versões atuais.
    ],
  };
};