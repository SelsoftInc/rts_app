// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAazrIX0oBk2LiRVFkfvI_JlOI7YjkMvxw',
    authDomain: 'fir-push-notify-6bdb6.firebaseapp.com',
    databaseURL: 'https://fir-push-notify-6bdb6.firebaseio.com',
    projectId: 'fir-push-notify-6bdb6',
    storageBucket: 'fir-push-notify-6bdb6.appspot.com',
    messagingSenderId: '363523602513'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
