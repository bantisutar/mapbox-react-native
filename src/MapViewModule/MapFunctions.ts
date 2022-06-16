import GeoFencing from 'react-native-geo-fencing'
import { printLog } from 'utils/GlobalFunctions'

export const checkIfLocationInsideField = (location: any[], fieldsListData: any) => {
  return new Promise((resolve, reject) => {
    let point = {
      lng: location[0],
      lat: location[1]
    }
    for (let elem of fieldsListData) {
      if (elem.geometry) {
        let geometry = JSON.parse(elem.geometry)
        var fieldObjects = geometry.coordinates[0].map(function (x: any[]) {
          return {
            lat: x[1],
            lng: x[0]
          }
        })
        GeoFencing.containsLocation(point, fieldObjects)
          .then((res: any) => {
            printLog('res...', res)
            resolve(elem)
          })
          .catch(() => {
            reject()
          })
      }
    }
  })
}

export const fitOnBoundingBox = (mapCamera: any, boundingBox: Array<any>, centerCoordinate: Array<any>) => {
  if (mapCamera) {
    if (boundingBox.length > 0) {
      const padding = 50.0
      mapCamera.setCamera({
        bounds: {
          ne: [boundingBox[2], boundingBox[1]],
          sw: [boundingBox[0], boundingBox[3]],
          paddingBottom: padding,
          paddingTop: padding,
          paddingLeft: padding,
          paddingRight: padding
        },
        animationDuration: 0,
        animationMode: 'flyTo'
      })
    } else {
      mapCamera.setCamera({
        animationDuration: 0,
        centerCoordinate: centerCoordinate,
        zoomLevel: 12
      })
    }
  } else {
    printLog('Camera  not available')
  }
}
