import filtersFieldMappings from "../mappings/filtersFieldMappings";
import featureToStrutturaMappings from "../mappings/featureToStrutturaMappings";
import version from "../assets/version.json";

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
    production: false,
    fieldMappings: featureToStrutturaMappings,
    filtersFieldMappings: filtersFieldMappings,
    mapStyle: './assets/map-styles/roadmap-style.json',
    dataPointColorMap: './assets/map-styles/data-points-colors.json',
    version: version.FullSemVer,
    firebaseConfig : {
        apiKey: "AIzaSyBrrHj-LuFs9IvKsNoHIq5a7-jJWK95QBk",
        authDomain: "moodmetervoid.firebaseapp.com",
        databaseURL: "https://moodmetervoid-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "moodmetervoid",
        storageBucket: "moodmetervoid.appspot.com",
        messagingSenderId: "45331867927",
        appId: "1:45331867927:web:cd34e172e861e40daf6f52"
    }
    // mapStyle: './assets/map-styles/dark-style.json'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
