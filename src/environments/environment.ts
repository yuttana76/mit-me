// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiURL: 'http://localhost:3000/api' // Development office
  // apiURL: 'https://203.151.63.131/api' // Azure Prod (192.168.10.58)
  // apiURL: 'http://203.151.63.132/api' // Azure Development (192.168.10.57)

  // apiURL: 'https://mpamapi.merchantasset.co.th/api' // PROD nginx
  // apiURL: 'https://mpamapi.merchantasset.co.th/api' // PROD nginx
};


