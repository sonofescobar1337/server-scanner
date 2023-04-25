const fs = require('fs');
const path = require('path');

const rootPath = 'YOUR PATH '; //EXAMPLE /var/www/html
const configFile = 'list.json';

fs.readFile(configFile, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const config = JSON.parse(data);

  function scanDirectory(dirPath) {
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
            scanDirectory(filePath);
          } else if (path.extname(file) === '.php') {
            fs.readFile(filePath, 'utf8', (err, data) => {
              if (err) {
                console.error(err);
                return;
              }

              let detected = false;
              config.forEach((backdoor) => {
                if (new RegExp(backdoor.backdoorRegex).test(data)) {
                  detected = true;
                  const message = `Backdoor terdeteksi (${filePath})`;
                  console.log(message);

                  fs.appendFile('log.txt', message + '\n', (err) => {
                    if (err) {
                      console.error(err);
                    }
                  });
                }
              });

              if (!detected) {
                console.log(`Tidak ada backdoor pada file ${filePath}`);
              }
            });
          } else if (path.extname(file) != '.php') {
            fs.readFile(filePath, 'utf8', (err, data) => {
              if (err) {
                console.error(err);
                return;
              }

              let detected = false;
              config.forEach((backdoor) => {
                if (new RegExp(backdoor.backdoorRegex).test(data)) {
                  detected = true;
                  const message = `Rootkit terdeteksi (${filePath})`;
                  console.log(message);

                  fs.appendFile('log.txt', message + '\n', (err) => {
                    if (err) {
                      console.error(err);
                    }
                  });
                }
              });

              if (!detected) {
                console.log(`Tidak ada backdoor pada file ${filePath}`);
              }
            });
          }
        });
      });
    });
  }

  scanDirectory(rootPath);
});
