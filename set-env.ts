const fs = require('fs');
require('dotenv').config();

if (process.env.PRODUCTION !== undefined && process.env.CRYPTR_CLIENT_ID !== undefined && process.env.RS_URL !== undefined) {
  var cryptrConfig = {
    audience: process.env.CRYPTR_AUDIENCE,
    tenant_domain: process.env.CRYPTR_TENANT_DOMAIN,
    client_id: process.env.CRYPTR_CLIENT_ID,
    cryptr_base_url: process.env.CRYPTR_BASE_URL,
    default_redirect_uri: process.env.CRYPTR_REDIRECT_URI,
    default_locale: process.env.CRYPTR_LOCALE || 'en',
    httpInterceptor: {
      apiRequestsToSecure: [
        process.env.RS_URL,
      ]
    },
    telemetry: process.env.CRYPTR_TELEMETRY == 'true',
    dedicated_server: process.env.CRYPTR_DEDICATED_SERVER == 'true',
  }
  console.debug(cryptrConfig);
  const envConfigFile = `export const environment = {
    production: ${process.env.PRODUCTION},
    cryptrConfig: ${cryptrConfig},
    resource_server_url: '${process.env.RS_URL}',
    idpIds: [${process.env.CRYPTR_IDP_IDS.split(',')}],
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
