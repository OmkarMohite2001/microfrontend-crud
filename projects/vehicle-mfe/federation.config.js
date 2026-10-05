const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'vehicle-mfe',

  exposes: {
    './routes': './projects/vehicle-mfe/src/pages/vehicle.routes.ts',
    './VehicleList': './projects/vehicle-mfe/src/pages/vehicle-list/vehicle-list.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
  ],

  features: {
    ignoreUnusedDeps: true,
  },
});
