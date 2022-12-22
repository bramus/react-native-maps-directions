import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Polyline } from 'react-native-maps';
import { LatLng } from './utils/types';
import { fetchRoutes } from './utils/fetcher';

const WAYPOINT_LIMIT = 10;

const MapViewDirections = (props) => {
  const [coordinates, setCoordinates] = useState(null);

  /** @param {(() => void) | null} cb */
  const resetState = (cb = null) => {
    setCoordinates(null);

    cb?.();
  };

  const fetchAndRenderRoute = async (props) => {
    const {
      origin: initialOrigin,
      destination: initialDestination,
      waypoints: initialWaypoints = [],
      apikey,
      splitWaypoints,
      timePrecision = 'none',
      onError,
      onReady,
      ...rest
    } = props;

    if (!apikey) {
      console.warn(`MapViewDirections Error: Missing API Key`); // eslint-disable-line no-console
      return;
    }

    if (!initialOrigin || !initialDestination) {
      return;
    }

    const timePrecisionString = timePrecision === 'none' ? '' : timePrecision;

    // Routes array which we'll be filling.
    // We'll perform a Directions API Request for reach route
    /** @type {({waypoints: (string|LatLng)[]; origin: string|LatLng; destination: string|LatLng})[]} */
    const routes = [];

    // We need to split the waypoints in chunks, in order to not exceede the max waypoint limit
    // ~> Chunk up the waypoints, yielding multiple routes
    if (
      splitWaypoints &&
      initialWaypoints &&
      initialWaypoints.length > WAYPOINT_LIMIT
    ) {
      // Split up waypoints in chunks with chunksize WAYPOINT_LIMIT
      const chunckedWaypoints = initialWaypoints.reduce(
        (accumulator, waypoint, index) => {
          const numChunk = Math.floor(index / WAYPOINT_LIMIT);
          accumulator[numChunk] = [].concat(
            accumulator[numChunk] || [],
            waypoint
          );

          return accumulator;
        },
        []
      );

      // Create routes for each chunk, using:
      // - Endpoints of previous chunks as startpoints for the route (except for the first chunk, which uses initialOrigin)
      // - Startpoints of next chunks as endpoints for the route (except for the last chunk, which uses initialDestination)
      for (let i = 0; i < chunckedWaypoints.length; i++) {
        routes.push({
          waypoints: chunckedWaypoints[i],
          origin:
            i === 0
              ? initialOrigin
              : chunckedWaypoints[i - 1][chunckedWaypoints[i - 1].length - 1],
          destination:
            i === chunckedWaypoints.length - 1
              ? initialDestination
              : chunckedWaypoints[i + 1][0],
        });
      }
    } else {
      // No splitting of the waypoints is requested/needed.
      // ~> Use one single route
      routes.push({
        waypoints: initialWaypoints,
        origin: initialOrigin,
        destination: initialDestination,
      });
    }

    try {
      const response = await Promise.all(
        routes.map((route, index) =>
          fetchRoutes({ ...route, ...rest, index, timePrecisionString })
        )
      );

      // Combine all Directions API Request results into one
      const result = response.reduce(
        (acc, curr) => {
          acc.coordinates.push(...curr.coordinates);
          acc.distance += curr.distance;
          acc.duration += curr.duration;
          acc.fares.push(curr.fare);
          acc.legs = legs;
          acc.waypointOrder.push(waypointOrder);

          return acc;
        },
        {
          coordinates: [],
          distance: 0,
          duration: 0,
          fares: [],
          legs: [],
          waypointOrder: [],
        }
      );

      // Plot it out and call the onReady callback
      setCoordinates(result.coordinates);
      onReady?.(result);
    } catch (err) {
      resetState();

      console.warn(`MapViewDirections Error: ${err}`);

      onError?.(err);
    }
  };

  useEffect(() => {
    if (!props.resetOnChange) {
      fetchAndRenderRoute(props);
      return;
    }

    resetState(() => fetchAndRenderRoute(props));
  }, [
    props.origin,
    props.destination,
    props.waypoints,
    props.mode,
    props.precision,
    props.splitWaypoints,
    props.avoid,
  ]);

  if (!coordinates || coordinates.length) return null;

  const {
    origin, // eslint-disable-line no-unused-vars
    waypoints, // eslint-disable-line no-unused-vars
    splitWaypoints, // eslint-disable-line no-unused-vars
    destination, // eslint-disable-line no-unused-vars
    apikey, // eslint-disable-line no-unused-vars
    onReady, // eslint-disable-line no-unused-vars
    onError, // eslint-disable-line no-unused-vars
    mode, // eslint-disable-line no-unused-vars
    language, // eslint-disable-line no-unused-vars
    region, // eslint-disable-line no-unused-vars
    precision, // eslint-disable-line no-unused-vars
    ...rest
  } = props;

  return <Polyline coordinates={coordinates} {...rest} />;
};

MapViewDirections.propTypes = {
  origin: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }),
  ]),
  waypoints: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
      }),
    ])
  ),
  destination: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }),
  ]),
  apikey: PropTypes.string.isRequired,
  onStart: PropTypes.func,
  onReady: PropTypes.func,
  onError: PropTypes.func,
  mode: PropTypes.oneOf(['DRIVING', 'BICYCLING', 'TRANSIT', 'WALKING']),
  language: PropTypes.string,
  resetOnChange: PropTypes.bool,
  optimizeWaypoints: PropTypes.bool,
  splitWaypoints: PropTypes.bool,
  directionsServiceBaseUrl: PropTypes.string,
  region: PropTypes.string,
  precision: PropTypes.oneOf(['high', 'low']),
  timePrecision: PropTypes.oneOf(['now', 'none']),
  channel: PropTypes.string,
  avoid: PropTypes.oneOf(['TOLLS', 'HIGHWAYS', 'FERRIES']),
};

export default MapViewDirections;
