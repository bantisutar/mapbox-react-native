import React from 'react'
import MapboxGL from '@react-native-mapbox-gl/maps'

interface RasterProps {
  image_id: string
  tilesUrl: string
  asset_id: string
  coordinates?: any
  visible?: any
}
const RasterTilesView = ({ image_id, tilesUrl, asset_id, coordinates }: RasterProps) => {
  const imageId = image_id || 'Image_raster_id' + String(Math.random())
  if (!tilesUrl) {
    return null
  }
  return (
    <MapboxGL.ImageSource id={imageId} url={tilesUrl} coordinates={coordinates}>
      <MapboxGL.RasterLayer id={imageId} sourceID={imageId} sourceLayerID={asset_id} layerIndex={8} />
    </MapboxGL.ImageSource>
  )
}

export default RasterTilesView
