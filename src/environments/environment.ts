// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiURL: 'http://localhost:3009/api' // Development
  // apiURL: 'http://192.168.50.22/api'// TEST nginx
  // apiURL: 'http://192.168.10.58/api'// PROD nginx
  // apiURL: 'https://mpamapi.merchantasset.co.th/api' // PROD nginx
};
