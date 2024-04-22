const fs = require('fs');
const path = require('path');

const color = {
  red: '\x1b[31m',
  white: '\x1b[37m',
  green: '\x1b[32m'
}

const options = {
  rootPath: '/var/www/html', // your path "EX ../var/www/html/web1/dir1"
  configFile: 'list.json', // config file
};

function loadConfig(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err || data === undefined) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}

function checkFile(filePath, config, type = 'Backdoor') {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    let detected = false;
    config.forEach((backdoor) => {
      if (new RegExp(backdoor.backdoorRegex).test(data)) {
        detected = true;
        let message;
        if (type === 'Backdoor') {
          message = `Backdoor terdeteksi (${filePath}) ${color.white}`;
        } else if (type === 'Localroot') {
          message = `Localroot terdeteksi (${filePath}) ${color.white}`;
        }
        console.log(color.green + message);

        fs.appendFile('log.txt', message + '\n', (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
    });

    if (!detected) {
      console.log(color.red + `Tidak ada backdoor pada file ${filePath} ${color.white}`);
    }
  });
}

function scanDirectory(dirPath, config) {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(dirPath, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }

        if (stats.isDirectory()) {
          scanDirectory(filePath, config);
        } else if (path.extname(file) === '.php') {
          checkFile(filePath, config, 'Backdoor');
        } else if (path.extname(file) != '.php') {
          checkFile(filePath, config, 'Localroot');
        }
      });
    });
  });
}

module.exports = { loadConfig, scanDirectory, options };
