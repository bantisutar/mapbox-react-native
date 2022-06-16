import { MAPBOX_API_KEY } from 'Constants/AppConfig'

export class MapApis {
  static searchPlaceApi = (searchText: any) => {
    return `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchText}.json?access_token=${MAPBOX_API_KEY}`
  }
}
