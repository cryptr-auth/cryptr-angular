const fs = require('fs');
require('dotenv').config();

if (process.env.PRODUCTION !== undefined && process.env.CRYPTR_CONFIG !== undefined && process.env.RS_URL !== undefined) {
  const envConfigFile = `export const environment = {
    production: ${process.env.PRODUCTION},
    cryptrConfig: ${process.env.CRYPTR_CONFIG},
    resource_server_url: '${process.env.RS_URL}',
    targetUrl: '${process.env.CRYPTR_TARGET_URL}'
  };
  `;

  const targetPath = './projects/playground/src/environments/environment.prod.ts';

  console.log(`The file '${targetPath}' will be written with the following content: \n`);
  console.log(envConfigFile);

  fs.exists("./projects/playground/src/environments/environment.prod.ts", (exists: boolean) => {
    if (exists) {
      fs.unlink("./projects/playground/src/environments/environment.prod.ts", (err: Error) => {
        if (err) {
          throw err;
        }
        fs.writeFile(
          "./projects/playground/src/environments/environment.prod.ts",
          envConfigFile,
          { flag: "wx" },
          (err: Error) => {
            if (err) {
              throw err;
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
