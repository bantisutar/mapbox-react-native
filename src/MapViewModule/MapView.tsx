import React from 'react'
import MapViewStyle from './MapStyle'
import MapboxGL from '@react-native-mapbox-gl/maps'

interface MapProps {
  children?: any
  coordinate?: any
  onPress?: any
  mapRef?: any
  onLongPress?: any
  onDidFinishLoadingMap?: any
  onUserLocationUpdate?: any
  onRegionDidChange?: any
}

const MapView = ({
  mapRef,
  onDidFinishLoadingMap,
  onPress,
  onLongPress,
  children,
  onUserLocationUpdate,
  onRegionDidChange
}: MapProps) => {
  return (
    <MapboxGL.MapView
      ref={mapRef}
      style={MapViewStyle.map}
      logoEnabled={false}
      onDidFinishLoadingMap={onDidFinishLoadingMap}
      onRegionDidChange={onRegionDidChange}
      localizeLabels={true}
      onUserLocationUpdate={onUserLocationUpdate}
      scrollEnabled={true}
      attributionEnabled={false}
      onPress={onPress}
      onLongPress={onLongPress}
      styleURL={MapboxGL.StyleURL.SatelliteStreet}>
      {children}
    </MapboxGL.MapView>
  )
}

export default MapView
