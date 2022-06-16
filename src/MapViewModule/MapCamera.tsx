import React from 'react'
import MapboxGL from '@react-native-mapbox-gl/maps'

interface cameraProps {
  coordinate?: any
  zoomLevel?: number
  cameraRef?: any
}

const MapCamera = ({ cameraRef, zoomLevel, coordinate }: cameraProps) => {
  return (
    <MapboxGL.Camera
      ref={cameraRef}
      zoomLevel={zoomLevel}
      minZoomLevel={10}
      maxZoomLevel={20}
      centerCoordinate={coordinate}
    />
  )
}

export default MapCamera
