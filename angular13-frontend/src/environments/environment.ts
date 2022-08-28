// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_URL: 'http://datasrv.firulais.net.ar:4444',
  AUTH_URL: 'http://datasrv.firulais.net.ar:4444',
  SKT1: {
    ENABLE: false,
    URL: 'http://datasrv.firulais.net.ar:4444',
    OPTIONS: {}
  },
  SKT2: {
    ENABLE: false,
    URL: 'http://datasrv.firulais.net.ar:4445',
    OPTIONS: {}
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
