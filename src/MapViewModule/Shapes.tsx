import React from 'react';
import {FillLayer, LineLayer} from './MapLayer';
const MapboxGL = require('@react-native-mapbox-gl/maps').default;

interface ShapesProps {
  coordinates: any;
  fillColor: any;
  strokeColor: any;
  idKey?: any;
  style?: any;
  shape?: any;
  panHandlers?: any;
}

const MapShapes = ({
  coordinates,
  fillColor,
  strokeColor,
  idKey,
}: ShapesProps) => {
  const _getShape = () => {
    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: coordinates,
      },
    };
  };

  return (
    <MapboxGL.ShapeSource
      id={'Polygon' + Math.random()}
      maxZoomLevel={17}
      onPress={(event: any) => {}}
      shape={_getShape()}>
      {FillLayer(fillColor)}
      {LineLayer(null, strokeColor)}
    </MapboxGL.ShapeSource>
  );
};

export default MapShapes;
