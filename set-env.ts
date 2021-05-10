const fs = require('fs');
require('dotenv').config();

if (process.env.PRODUCTION !== undefined && process.env.CRYPTR_CONFIG !== undefined && process.env.RS_URL !== undefined) {
  const envConfigFile = `export const environment = {
    production: ${process.env.PRODUCTION},
    cryptrConfig: ${process.env.CRYPTR_CONFIG},
    resource_server_url: '${process.env.RS_URL}'
  };
  `;

  const targetPath = './projects/playground/src/environments/environment.prod.ts';

  console.log(`The file '${targetPath}' will be written with the following content: \n`);
  console.log(envConfigFile);

  fs.exists(`${targetPath}`, (exists: boolean) => {
    if (exists) {
      fs.unlink(`${targetPath}`, (err: any) => {
        if (err) {
          throw err;
        }
        fs.writeFile(`${targetPath}`, envConfigFile, { flag: "wx" }, (err: any) => {
          if (err) {
            throw console.error(err);
          }
        })
      });
    } else {
      console.error("file not found :/");
    }
  });
} else {
  console.info("no .env variable found -> use files");
}
