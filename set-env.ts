const fs = require('fs');
require('dotenv').config();

if (process.env.PRODUCTION !== undefined && process.env.CRYPTR_CONFIG !== undefined && process.env.RS_URL !== undefined) {
  const envConfigFile = `export const environment = {
    production: ${process.env.PRODUCTION},
    cryptrConfig: ${process.env.CRYPTR_CONFIG},
    resource_server_url: '${process.env.RS_URL}'
  };
  `;

  const targetPath = './projects/playground/src/environments/environment.prod.ts'

  console.log(`The file '${targetPath}' will be written with the following content: \n`);
  console.log(envConfigFile);


  console.log("Try deleting")
  fs.existsSync(targetPath, function (exists) {
    console.log(`file ${targetPath} exists: ${exists}`)
    if (exists) {
      //Show in green
      console.log('File exists. Deleting now ...');
      fs.unlink(targetPath, function (err) {
        if (err) {
          throw console.error(err)
        }
        console.log("Try writing")
        fs.writeFile(targetPath, envConfigFile, { flag: 'wx' }, function (err) {
          if (err) {
            throw console.error(err)
          } else {
            console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`)
          }
        })
      });
    } else {
      console.log("file not found :/")
    }
  });
} else {
  console.info("no .env variable found -> use files")
  console.debug(process.env.PRODUCTION)
  console.debug(process.env.CRYPTR_CONFIG)
  console.debug(process.env.RS_URL)
}
