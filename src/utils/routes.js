import { resolveRoutes } from './promise';
import { convertUrl } from './url';
import { RouteOptions } from './types';
import { BASE_URL } from './constant';

/**
 * Fetch the GMaps Routes from the given options
 * @param {RouteOptions} options
 * @returns {Promise}
 */
export const fetchRoute = async ({
  mode = 'DRIVING',
  language = 'en',
  precision = 'low',
  ...options
}) => {
  const url = convertUrl(options);

  try {
    const json = (await fetch(url)).json();

    if (json.status !== 'OK') {
      const errorMessage = json.error_message || json.status || 'Unknown error';

      return Promise.reject(errorMessage);
    }

    if (!json.routes.length) {
      return Promise.reject();
    }

    const route = json.routes[0];

    return Promise.resolve(resolveRoutes(route));
  } catch (err) {
    return Promise.reject(`Error on GMAPS route request: ${err}`);
  }
};
