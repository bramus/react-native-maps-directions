import { decode } from './decoder';

/**
 * Resolve fetched routes
 * @param {google.maps.DirectionsRoute} route
 */

export const resolveRoutes = (route) => ({
  distance:
    route.legs.reduce((carry, curr) => carry + curr.distance.value, 0) / 1000,
  duration:
    route.legs.reduce(
      (carry, curr) =>
        carry +
        (curr.duration_in_traffic
          ? curr.duration_in_traffic.value
          : curr.duration.value),
      0
    ) / 60,
  coordinates:
    precision === 'low'
      ? decode([{ polyline: route.overview_polyline }])
      : route.legs.reduce(
          (carry, curr) => [...carry, ...decode(curr.steps)],
          []
        ),
  fare: route.fare,
  waypointOrder: route.waypoint_order,
  legs: route.legs,
});
