# `react-native-maps-directions`

[![npm version](https://img.shields.io/npm/v/react-native-maps-directions.svg?style=flat)](https://www.npmjs.com/package/react-native-maps-directions)
![npm](https://img.shields.io/npm/dm/react-native-maps-directions.svg)
![GitHub contributors](https://img.shields.io/github/contributors/bramus/react-native-maps-directions.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/bramus/react-native-maps-directions.svg)
![NPM](https://img.shields.io/npm/l/react-native-maps-directions.svg)

Directions component for [`react-native-maps`](https://github.com/airbnb/react-native-maps/) – Draw a route between two coordinates, powered by the Google Maps Directions API

![react-native-maps-directions](https://user-images.githubusercontent.com/213073/33188062-efc86e24-d096-11e7-87eb-6925291bc809.png)

## Installation

Install `react-native-maps-directions` as a dependency using either

- [Node's `npm`](https://nodejs.org/en/download/)

  ```
  npm install react-native-maps-directions
  ```

- [Yarn](https://yarnpkg.com/en/docs/install)

  ```
  yarn add react-native-maps-directions
  ```

## Basic Usage

Import `MapViewDirections` and render it as a child of a `MapView` component. The mandatory `MapViewDirections` props are:

- `origin`: The origin location to start routing from
- `destination`: The destination location to start routing to
- `apikey`: Your Google Maps Directions API Key _(request one [here](https://developers.google.com/maps/documentation/directions/get-api-key); if you're using an existing Google Maps API Key make sure you've enabled the Google Maps Directions API for that key using the [Google API Console](https://console.developers.google.com/apis/))_.

```js
import MapViewDirections from 'react-native-maps-directions';

const origin = {latitude: 37.3318456, longitude: -122.0296002};
const destination = {latitude: 37.771707, longitude: -122.4053769};
const GOOGLE_MAPS_APIKEY = '…';

<MapView initialRegion={…}>
  <MapViewDirections
    origin={origin}
    destination={destination}
    apikey={GOOGLE_MAPS_APIKEY}
  />
</MapView>
```

Once the directions in between `destination` and `origin` has been fetched, a `MapView.Polyline` between the two will be drawn. Whenever one of both changes, new directions will be fetched and rendered.

## Component API

### Props

| Prop | Type | Default | Note
|---|---|---|---|
| `origin` | `LatLng` or `String` | | The origin location to start routing from.
| `destination` | `LatLng` or `String` | | The destination location to start routing to.
| `apikey` | `String` | | Your Google Maps API Key _(request one [here](https://developers.google.com/maps/documentation/directions/get-api-key); if you're using an existing Google Maps API Key make sure you've enabled the Google Maps Directions API for that key using the [Google API Console](https://console.developers.google.com/apis/) by hitting the “Enable APIs and Services“ button)_.
| `waypoints` | [`LatLng` or `String`] |  | Array of waypoints to use between origin and destination.
| `language` | `String` | `"en"` | The language to use when calculating directions. See [here](https://developers.google.com/maps/documentation/javascript/localization) for more info.
| `mode` | `String` | `"DRIVING"` | Which transportation mode to use when calculating directions. Allowed values are `"DRIVING"`, `"BICYCLING"`, `"WALKING"`, and `"TRANSIT"`. _(See [here](https://developers.google.com/maps/documentation/javascript/examples/directions-travel-modes) for more info)_.
| `resetOnChange` | `boolean` | `true` | Tweak if the rendered `MapView.Polyline` should reset or not when calculating the route between `origin` and `destionation`. Set to `false` if you see the directions line glitching.
| `optimizeWaypoints` | `boolean` | `false` | Set it to true if you would like Google Maps to re-order all the waypoints to optimize the route for the fastest route. Please be aware that if this option is enabled, you will be billed for a higher rate by Google as stated [here](https://developers.google.com/maps/documentation/javascript/directions#Waypoints).
| `directionsServiceBaseUrl` | `string` | _(Google's)_ | Base URL of the Directions Service (API) you are using. By default the Google Directions API is used (`"https://maps.googleapis.com/maps/api/directions/json"`). Usually you won't need to change this.
| `region` | `String` | | If you are using strings for **origin** or **destination**, sometimes you will get an incorrect route because Google Maps API needs the region where this places belong to. See [here](https://developers.google.com/maps/documentation/javascript/localization#Region) for more info.
| `autoTransitColor` | `boolean` | `false` | Set it to true if you would like the directions line to be split in to coloured segments based on the transport type.

#### More props

Since the result rendered on screen is a `MapView.Polyline` component, all [`MapView.Polyline` props](https://github.com/airbnb/react-native-maps/blob/master/docs/polyline.md#props) – except for `coordinates` – are also accepted.

```js
<MapView initialRegion={…}>
  <MapViewDirections
    origin={origin}
    destination={destination}
    apikey={GOOGLE_MAPS_APIKEY}
    strokeWidth={3}
    strokeColor="hotpink"
  />
</MapView>
```

#### An extra note on `origin` and `destination`

The values for the `origin` and `destination` props can take several forms. They can either be:

- Coordinates in the form of an object with `latitude` and `longitude` keys
- Coordinates in the form of a string  with `latitude` and `longitude` values separated by a comma
- Strings representing an address
- Strings representing a location
- Strings containing a Place Id from the Google Maps Place API prefixed with `place_id:`

All examples below have the same `origin` location, represented in the formats mentioned above:

```js
<MapViewDirections origin={{ latitude: 37.3317876, longitude: -122.0054812 }} destination="…" />
<MapViewDirections origin="37.3317876,-122.0054812" destination="…" />
<MapViewDirections origin="Apple Park Visitor Center" destination="…" />
<MapViewDirections origin="10600 N Tantau Ave, Cupertino, CA 95014, USA" destination="…" />
<MapViewDirections origin="place_id:ChIJW5i0tJC1j4ARoUGtkogTaUU" destination="…" />
```

Note: The `origin` and `destination` props don't need to use the same representation, you may mix them.

Tip: Don't forget to tweak the `language` prop when using localized location names.

### Events/Callbacks

| Event Name | Returns | Notes
|---|---|---|
| `onStart` | `{ origin, destination, waypoints: [] }` | Callback that is called when the routing has started.
| `onReady` | `{ distance: Number, duration: Number, durationText: String, coordinates: [], fare: Object. steps: [] }` | Callback that is called when the routing has succesfully finished. Note: distance returned in kilometers and duration in minutes.
| `onError` | `errorMessage` | Callback that is called in case the routing has failed.

## Extended Example

This example will draw a route between AirBnB's Office and Apple's HQ

```js
import React, { Component } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.771707;
const LONGITUDE = -122.4053769;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_MAPS_APIKEY = '…';

class Example extends Component {

  constructor(props) {
    super(props);

    // AirBnB's Office, and Apple Park
    this.state = {
      coordinates: [
        {
          latitude: 37.3317876,
          longitude: -122.0054812,
        },
        {
          latitude: 37.771707,
          longitude: -122.4053769,
        },
      ],
    };

    this.mapView = null;
  }

  onMapPress = (e) => {
    this.setState({
      coordinates: [
        ...this.state.coordinates,
        e.nativeEvent.coordinate,
      ],
    });
  }

  render() {
    return (
      <MapView
        initialRegion={{
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        style={StyleSheet.absoluteFill}
        ref={c => this.mapView = c}
        onPress={this.onMapPress}
      >
        {this.state.coordinates.map((coordinate, index) =>
          <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate} />
        )}
        {(this.state.coordinates.length >= 2) && (
          <MapViewDirections
            origin={this.state.coordinates[0]}
            waypoints={ (this.state.coordinates.length > 2) ? this.state.coordinates.slice(1, -1): null}
            destination={this.state.coordinates[this.state.coordinates.length-1]}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="hotpink"
            optimizeWaypoints={true}
            onStart={(params) => {
              console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
            }}
            onReady={result => {
              console.log('Distance: ${result.distance} km')
              console.log('Duration: ${result.duration} min.')
              
              this.mapView.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  right: (width / 20),
                  bottom: (height / 20),
                  left: (width / 20),
                  top: (height / 20),
                }
              });
            }}
            onError={(errorMessage) => {
              // console.log('GOT AN ERROR');
            }}
          />
        )}
      </MapView>
    );
  }
}

export default Example;
```

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Credits

- Bram(us) Van Damme <em>([https://www.bram.us/](https://www.bram.us/))</em>
- [All Contributors](../../contributors)

This code is inspired upon the article [React Native Maps with Google Directions Api](https://medium.com/@ali_oguzhan/react-native-maps-with-google-directions-api-bc716ed7a366) by [Ali Oğuzhan Yıldız](https://github.com/alioguzhan).

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
