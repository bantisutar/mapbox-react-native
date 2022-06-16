import React from 'react';
import {View, Image} from 'react-native';

import MapViewStyle from './MapStyle';

const MapboxGLView = require('@react-native-mapbox-gl/maps').default;

interface MarkerProps {
  title?: string;
  coordinate: any;
  anchor?: any;
  keyID?: any;
  onDragEnd?: any;
  childView?: any;
  refMarker?: any;
  onDragStart?: any;
  onPressMarker?: any;
  draggable?: any;
  bearingDegree?: any;
}

const MarkerView = ({
  onDragEnd,
  coordinate,
  keyID,
  anchor,
  childView,
  refMarker,
  onDragStart,
  onPressMarker,
  draggable,
  bearingDegree,
}: MarkerProps) => {
  let id = 'user-location';

  return (
    <MapboxGLView.PointAnnotation
      style={{transform: [{rotate: bearingDegree ? bearingDegree : '0deg'}]}}
      onDragEnd={onDragEnd}
      aboveLayerID="routeline"
      onSelected={(e: any) => onPressMarker && onPressMarker(e)}
      anchor={anchor}
      onDragStart={onDragStart}
      id={keyID ? keyID : id}
      key={keyID + Math.random()}
      draggable={draggable !== undefined ? draggable : true}
      coordinate={coordinate}
      title=""
      ref={refMarker}>
      {childView ? (
        childView
      ) : (
        <View style={MapViewStyle.markerUserContainer}>
          <Image
            style={{height: 50, width: 50}}
            source={{
              uri: 'https://w7.pngwing.com/pngs/731/25/png-transparent-location-icon-computer-icons-google-map-maker-marker-pen-cartodb-map-marker-heart-logo-color-thumbnail.png',
            }}
          />
        </View>
      )}
    </MapboxGLView.PointAnnotation>
  );
};

export default MarkerView;
