// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiURL: 'http://localhost:3000/api' // Development office
  // apiURL: 'http://203.151.63.132:3000/api' // Development mac
  // apiURL: 'https://192.168.10.58/api' // Development
  // apiURL: 'https://mpamapi.merchantasset.co.th/api' // PROD nginx
};


