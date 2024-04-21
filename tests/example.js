const { loadConfig, scanDirectory, options } = require('../src/index.js');

const { rootPath, configFile } = options;

loadConfig(configFile)
  .then((cfg) => scanDirectory(rootPath, cfg))
  .catch((err) => {
    console.error(err);
  });
