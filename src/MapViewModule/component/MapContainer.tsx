import React, {useEffect, useRef, useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import MapShapes from '../Shapes';
import MarkerView from '../Marker';
import * as turf from '@turf/turf';

const MapContainer = () => {
  const [drawDot, setCurrentDrawDots] = useState<any>();
  const [firstViewLocation, setFirstView] = useState<boolean>(true);
  const [enableDraw, setEnableDraw] = useState<boolean>(false);
  const [drawFinished, setDrawFinished] = useState<any>();
  const [undoDraw, setDrawUndo] = useState<any>();
  const [disablePolygonCircle, setDisablePolygonCircle] =
    useState<boolean>(true);
  const [fieldListArray, setFieldListArray] = useState<any>([]);

  const mapRef = useRef<MapboxGL.MapView>(null);
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const midPointOfLine = (from: any, to: any) => {
    let point1 = turf.point(from);
    let point2 = turf.point(to);
    let midpoints = turf.midpoint(point1, point2);
    return midpoints;
  };
  /** MapView Tap Action */
  const onPress = (e: any) => {
    if (!drawDot) {
      let obj = {
        coordinates: [e.geometry.coordinates],
      };
      setCurrentDrawDots(obj);
    } else if (drawDot) {
      setCurrentDrawDots({
        ...drawDot,
        coordinates: [...drawDot.coordinates, e.geometry.coordinates],
      });
    } else {
      setCurrentDrawDots({
        coordinates: [e.geometry.coordinates],
      });
    }
    setDrawUndo({...drawDot});
    setDisablePolygonCircle(true);
  };

  /**  Create Shape on MapView*/
  const createDrawOnMap = () => {
    if (drawDot && drawDot.coordinates) {
      let shapeCoordinate = [] as any;
      shapeCoordinate = [drawDot.coordinates];
      return (
        <>
          {shapeCoordinate.length > 0 && createShapeSource(shapeCoordinate)}
          {shapeCoordinate[0].map((coordinate: any, index: any) =>
            createMarkerView(coordinate, index, false),
          )}
        </>
      );
    }
    return;
  };
  /** create marker on map */
  const createMarkerView = (
    coordinates?: any,
    index?: any,
    addMidPoints?: any,
  ) => {
    let idKey = index ? index : 0;
    let styleView = mapInfoStyles.markerPointer;
    if (addMidPoints) {
      styleView =
        index % 2 === 0
          ? mapInfoStyles.markerPointer
          : mapInfoStyles.midPointer;
    }
    if (enableDraw) {
      if (index === 0) {
        styleView = mapInfoStyles.midPointer;
      } else {
        styleView = mapInfoStyles.markerPointer;
      }
    }

    return (
      <MarkerView
        keyID={idKey.toString()}
        key={idKey.toString()}
        coordinate={coordinates}
        onPressMarker={(e: any) => onPressMarker(e)}
        anchor={{x: 0.5, y: 0.5}}
        onDragEnd={(e: any) => {
          changePolygonCoordinate(e, index);
        }}
        childView={
          <View key={idKey.toString() + '_subview'} style={styleView} />
        }
      />
    );
  };
  /**  Get New Coordinates of Polygon on Tap*/

  const changePolygonCoordinate = (e: any, index: any) => {
    let newDraw = enableDraw && drawDot ? drawDot : drawFinished;
    let previousData = {...newDraw};
    setDrawUndo(previousData);

    let newCoords = e.geometry.coordinates;

    let arrCoords = [...newDraw.coordinates];
    arrCoords[index] = newCoords;
    setDrawFinished({...newDraw, coordinates: arrCoords});
    console.log('init value====', drawFinished);
    setCurrentDrawDots({...newDraw, coordinates: arrCoords});
  };

  /** On press marker*/
  const onPressMarker = (e: any) => {
    let drawFinisheds = {...drawFinished};

    if (!enableDraw && drawFinisheds) {
      let currentSelectedIndex = Number(e.properties.id);
      let coordsArr = drawFinisheds?.coordinates;
      let lastIndexOfArr = coordsArr.length - 1;

      if (currentSelectedIndex % 2 === 0) {
        if (coordsArr.length > 7) {
          let previousIndex =
            currentSelectedIndex === 0
              ? lastIndexOfArr
              : currentSelectedIndex - 1;

          if (currentSelectedIndex === 0) {
            coordsArr.splice(lastIndexOfArr, 1);
            coordsArr.splice(0, 1);
            coordsArr.splice(0, 1);

            let midPointBack = midPointOfLine(
              coordsArr[0],
              coordsArr[coordsArr.length - 1],
            ).geometry!.coordinates as any;
            coordsArr.push(midPointBack);

            let newDrawCoordinator = {...drawFinisheds, coordinates: coordsArr};
            setDrawFinished(newDrawCoordinator);
            setCurrentDrawDots(null);
          } else if (currentSelectedIndex === lastIndexOfArr) {
          } else {
            coordsArr.splice(previousIndex, 1);
            coordsArr.splice(previousIndex + 1, 1);
            coordsArr.splice(previousIndex, 1);

            let ToPoint =
              previousIndex > coordsArr.length - 1 ? 0 : previousIndex;
            let midPointBack = midPointOfLine(
              coordsArr[previousIndex - 1],
              coordsArr[ToPoint],
            ).geometry!.coordinates as any;
            coordsArr.splice(previousIndex, 0, midPointBack);
            let newDrawCoord = {...drawFinisheds, coordinates: coordsArr};
            setDrawFinished(newDrawCoord);
            setCurrentDrawDots(null);
          }
        }
        return;
      }

      let toPointBack =
        currentSelectedIndex === 0 ? lastIndexOfArr : currentSelectedIndex - 1;
      let toPointFwd =
        currentSelectedIndex + 1 === lastIndexOfArr
          ? 0
          : currentSelectedIndex + 1;
      if (currentSelectedIndex === 0) {
        toPointBack = lastIndexOfArr;
        toPointFwd = currentSelectedIndex + 1;
        let midPointFwd = midPointOfLine(
          coordsArr[currentSelectedIndex],
          coordsArr[toPointFwd],
        ).geometry!.coordinates as any;
        let midPointBack = midPointOfLine(
          coordsArr[currentSelectedIndex],
          coordsArr[toPointBack],
        ).geometry!.coordinates as any;
        coordsArr.splice(toPointFwd, 0, midPointFwd);
        coordsArr.splice(currentSelectedIndex, 0, midPointBack);
      } else if (currentSelectedIndex === lastIndexOfArr) {
        toPointBack = currentSelectedIndex - 1;
        toPointFwd = 0;
        let midPointFwd = midPointOfLine(
          coordsArr[currentSelectedIndex],
          coordsArr[toPointFwd],
        ).geometry!.coordinates as any;
        let midPointBack = midPointOfLine(
          coordsArr[currentSelectedIndex],
          coordsArr[toPointBack],
        ).geometry!.coordinates as any;
        coordsArr.splice(currentSelectedIndex, 0, midPointBack);
        coordsArr.push(midPointFwd);
      } else {
        toPointBack = currentSelectedIndex - 1;
        toPointFwd = currentSelectedIndex + 1;
        let midPointFwd = midPointOfLine(
          coordsArr[currentSelectedIndex],
          coordsArr[toPointFwd],
        ).geometry!.coordinates as any;
        let midPointBack = midPointOfLine(
          coordsArr[currentSelectedIndex],
          coordsArr[toPointBack],
        ).geometry!.coordinates as any;
        coordsArr.splice(toPointFwd, 0, midPointFwd);
        coordsArr.splice(currentSelectedIndex, 0, midPointBack);
      }
      let newDraw = {...drawFinished, coordinates: coordsArr};
      setDrawFinished(newDraw);
      setCurrentDrawDots(null);
    } else {
    }
  };
  const completeDrawView = () => {
    if (enableDraw) {
      let coordinates = [] as any;
      if (drawDot && drawDot.coordinates.length >= 3) {
        let allPoint: any[] = [];
        drawDot.coordinates.forEach((element: any, index: any) => {
          let tempIndex = index + 1;
          if (tempIndex < drawDot.coordinates.length) {
            let fromPoint = drawDot.coordinates[index];
            let toPoint = drawDot.coordinates[tempIndex];
            let midPoint = midPointOfLine(fromPoint, toPoint) as any;
            allPoint.push(fromPoint);
            allPoint.push(midPoint.geometry.coordinates);
          } else {
            let fromPoint = drawDot.coordinates[tempIndex - 1];
            let toPoint = drawDot.coordinates[0];
            let midPoint = midPointOfLine(fromPoint, toPoint) as any;
            allPoint.push(fromPoint);
            allPoint.push(midPoint.geometry.coordinates);
          }
        });
        let finalData = {...drawDot, coordinates: allPoint};
        //setPreviousData(finalData)
        setDrawFinished(finalData);
        setCurrentDrawDots(null);
        setEnableDraw(false);
        setDisablePolygonCircle(true);
      } else {
      }
      setDrawUndo(null);
    }
  };
  const getAreaOfShape = (coordinates: any) => {
    var polygons = turf.polygon([coordinates]);
    let areaSq = turf.area(polygons);
    areaSq = convertSqMetersToHectare(areaSq); // converted to ht
    return Number(areaSq).toFixed(2);
  };
  const convertSqMetersToHectare = (sqMeter: any) => {
    return sqMeter / 10000;
  };
  /** Add Marker on polygon edge*/
  const createShapeSource = (
    shapeCoordinate: any,
    _stokeColor?: any,
    _fillColor?: any,
  ) => {
    return (
      <MapShapes
        coordinates={shapeCoordinate}
        strokeColor={_stokeColor ? _stokeColor : 'white'}
        fillColor={_fillColor ? _fillColor : 'green'}
      />
    );
  };
  const getFieldView = () => {
    let mappedArr: any;
    mappedArr = fieldListArray?.map((obj: any) => {
      if (obj.geometry) {
        return createShapeSource(JSON.parse(obj.geometry).coordinates, 'white');
      }
      return <></>;
    });
    mappedArr = mappedArr.filter((obj: any) => obj !== undefined);
    return mappedArr;
  };
  const finishedButtonAction = () => {
    console.log('drawFinished', drawFinished);
    let coordinates = drawFinished?.coordinates;
    let lat = drawFinished?.coordinates[0][0];
    let lat2 =
      drawFinished?.coordinates[drawFinished.coordinates.length - 1][0];
    coordinates =
      lat === lat2
        ? drawFinished?.coordinates
        : [...drawFinished.coordinates, drawFinished.coordinates[0]];

    let newField = {
      calculated: 0,
      geometry: {},
      name: 'AbC',
      city: 'Pune',
    };
    let calculatedArea = getAreaOfShape(coordinates);
    newField.calculated = Number(calculatedArea);
    let obj = {
      coordinates: [coordinates],
      type: 'Polygon',
    };
    newField.geometry = obj;
    console.log('newField =======', JSON.stringify(newField));
  };
  return (
    <View style={{flex: 1}}>
      <MapboxGL.MapView
        ref={mapRef}
        attributionEnabled={false}
        styleURL={'mapbox://styles/mapbox/satellite-streets-v11'}
        style={{flex: 1}}
        logoEnabled={false}
        onPress={(e: any) => enableDraw && onPress(e)}>
        <MapboxGL.Camera
          ref={cameraRef}
          followZoomLevel={5}
          zoomLevel={5}
          animationMode={'moveTo'}
          animationDuration={500}
          centerCoordinate={[73.78, 18.55]}
        />
        <MapboxGL.UserLocation
          renderMode="normal"
          animated={true}
          visible={firstViewLocation}
        />
        {enableDraw ? createDrawOnMap() : <View />}
        {getFieldView()}
        {drawFinished !== null && drawFinished?.coordinates && (
          <>
            {createShapeSource([drawFinished?.coordinates], 'white')}
            {drawFinished?.coordinates.map((coordinate: any, index: any) =>
              createMarkerView(coordinate, index, true),
            )}
          </>
        )}
      </MapboxGL.MapView>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={{backgroundColor: 'yellow', padding: 20}}
          onPress={() => setEnableDraw(true)}>
          <Text>Enable Draw</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{backgroundColor: 'red', padding: 20}}
          onPress={() => completeDrawView()}>
          <Text> complete Draw</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{backgroundColor: 'green', padding: 20}}
          onPress={() => finishedButtonAction()}>
          <Text> Finish Draw</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const mapInfoStyles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  containerMap: {
    width: '100%',
    height: '100%',
    backgroundColor: 'green',
    position: 'absolute',
  },
  markerPointer: {
    width: 26,
    height: 26,
    borderRadius: 50,
    borderColor: 'white',
    borderWidth: 8,
    backgroundColor: 'transparent',
  },
  midPointer: {
    width: 20,
    height: 20,
    borderRadius: 8,
    borderWidth: 5,
    borderColor: 'gray',
    backgroundColor: 'white',
  },

  markerSubPointer: {
    width: 9,
    height: 9,
    borderRadius: 9 / 2,
    backgroundColor: 'transparent',
    borderColor: 'gray',
    borderWidth: 3,
  },
});
export default MapContainer;
