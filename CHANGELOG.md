# `react-native-maps-directions` Changelog

## 1.7.3 - 2019-10-02

- Add `precision` prop to allow one to choose between the ”Steps Polyline” and “Overview Polyline”

## 1.7.2 - 2019-10-02

- Fix bug where duration was wrongfully calculated when using waypoints
- Fix bug where not all legs of a route were drawn

## 1.7.1 - 2019-10-02

- Fall back to standard duration in case “duration with traffic” is not given
- Use “Steps polyline”, instead of “Overview polyline” (regression fix)
- Update dependencies

## 1.7.0 - 2019-05-17

- Add `optimizeWaypoints` prop to allow use of waypoints optimization.
- Add `region` prop.
- Return “Duration with traffic” as `duration`
- Return `fare` in `onReady`


## 1.6.0 - 2018-03-09

- Add `directionsServiceBaseUrl` prop to allow customisation of service to use.

## 1.5.0 - 2018-02-23

- Add support for `resetOnChange` prop to prevent glitches whenn recalculating (#21)
- Add `onStart` callback prop to know when routing starts

## 1.4.1 - 2018-01-31

- Fix a bug where new origin/destination objects (with same values) trigger an endless loop (#13)

## 1.4.0 - 2018-01-07

- Add support for waypoints (#10)

## 1.3.0 - 2017-12-21

- Fix “Unmouting while a fetch is still in progress yields a warning” #5

## 1.2.0 - 2017-12-12

- Add `language` and `mode` props

## 1.1.0 - 2017-11-23

- Add `onReady` and `onError` events/callbacks

## 1.0.0 - 2017-11-19

- initial release
