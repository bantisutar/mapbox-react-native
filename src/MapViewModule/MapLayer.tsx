import React from 'react'
const MapboxGL = require('@react-native-mapbox-gl/maps').default

export const FillLayer = (fillColor: any) => (
  <MapboxGL.FillLayer id={'routefill' + Math.random()} layerIndex={2} style={{ fillColor: fillColor }} />
)

export const LineLayer = (style?: any, strokeColor?: any) => {
  let styleNew = style
    ? style
    : {
        lineWidth: 5,
        lineJoin: 'round',
        lineCap: 'round',
        lineColor: strokeColor ? strokeColor : 'white'
      }

  return <MapboxGL.LineLayer id={'routeline' + Math.random()} layerIndex={2} style={styleNew} />
}
