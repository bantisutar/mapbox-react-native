import React from 'react';
import MapContainer from './src/MapViewModule/component/MapContainer';
const MapboxGL = require('@react-native-mapbox-gl/maps').default;

MapboxGL.setAccessToken(
  <YOUR_ACCESS_TOKEN>
);
MapboxGL.Logger.sharedInstance().stop();
MapboxGL.setTelemetryEnabled(false);
const App = () => {
  return <MapContainer />;
};
export default App;
