// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  recaptcha: {
    siteKey: '6LcZvsMhAAAAAMdUWL2_eBafhA7_BUAZyrQnnyyN'
  },
  production: false,
  WAP_API: 'https://wapi1.vta.ar',
  WAP_MEDIA: 'https://wapi1.vta.ar/media',
  API_URL: 'https://api01.vta.ar',
  AUTH_URL: 'https://api01.vta.ar',
  SKT1: {
    ENABLE: false,
    URL: 'https://api01.vta.ar',
    OPTIONS: {}
  },
  SKT2: {
    ENABLE: false,
    URL: 'https://wapi1.vta.ar',
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
