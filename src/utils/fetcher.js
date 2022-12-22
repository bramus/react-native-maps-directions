import { fetchRoute } from './routes';
import { RouteOptions } from './types';

/**
 * @param {RouteOptions} options
 */
export const fetchRoutes = async (options) => {
  let { destination, origin, waypoints, optimizeWaypoints } = options;

  if (typeof origin === 'object' && Object.values(origin).length === 2) {
    origin = Object.values(origin).join(',');
  }

  if (
    typeof destination === 'object' &&
    Object.values(destination).length === 2
  ) {
    destination = Object.values(destination).join(',');
  }

  waypoints = waypoints
    .map((waypoint) => {
      if (
        typeof waypoint === 'object' &&
        Object.values(waypoint).length === 2
      ) {
        return Object.values(waypoint).join(',');
      }

      return waypoint;
    })
    .join('|');

  if (optimizeWaypoints) {
    waypoints = `optimize:true|${waypoints}`;
  }

  if (options.index === 0)
    options?.onStart?.({
      origin,
      destination,
      waypoints: options.waypoints,
    });

  try {
    const result = fetchRoute({ ...options, origin, destination });

    return result;
  } catch (err) {
    return Promise.reject(err);
  }
};
