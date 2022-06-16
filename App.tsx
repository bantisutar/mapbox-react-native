import React from 'react';
import MapContainer from './src/MapViewModule/component/MapContainer';
const MapboxGL = require('@react-native-mapbox-gl/maps').default;

MapboxGL.setAccessToken(
  'pk.eyJ1Ijoicm9zaGFucmFtZGFzMTciLCJhIjoiY2thcWZ3dzBrMGJ0dzJ4cHcxeXJoMWZpNSJ9.iTZM4T8POBxb-Eb2mTCAHA',
);
MapboxGL.Logger.sharedInstance().stop();
MapboxGL.setTelemetryEnabled(false);
const App = () => {
  return <MapContainer />;
};
export default App;
