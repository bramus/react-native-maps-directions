import { BASE_URL } from './constant';
import { RouteOptions } from './types';

/**
 * Convert the url in a way so GMaps can process
 * @param {RouteOptions} options
 * @returns {string}
 */
export const convertUrl = (options) => {
  // Define the URL to call. Only add default parameters to the URL if it's a string.

  let url = typeof options.url === 'string' ? options.url : BASE_URL;

  /** @type {string[]} */
  const query = [];

  if (typeof options.apikey === 'string' && options.apikey.trim() !== '') {
    query.push(`key=${options.apikey}`);
  }

  if (
    typeof options.waypoints === 'string' &&
    options.waypoints.trim() !== ''
  ) {
    query.push(`waypoints=${options.waypoints}`);
  }

  if (typeof options.origin === 'string' && options.origin.trim() !== '') {
    query.push(`origin=${options.origin}`);
  }

  if (
    typeof options.origin === 'object' &&
    Array.isArray(options.origin) &&
    options.origin.length
  ) {
    query.push(`origin=${options.origin.join(',')}`);
  }

  if (
    typeof options.destination === 'string' &&
    options.destination.trim() !== ''
  ) {
    query.push(`destination=${options.destination}`);
  }

  if (
    typeof options.destination === 'object' &&
    Array.isArray(options.destination) &&
    options.destination.length
  ) {
    query.push(`destination=${options.destination.join(',')}`);
  }

  if (
    typeof options.avoid === 'object' &&
    Array.isArray(options.avoid) &&
    options.avoid.length
  ) {
    query.push(
      `avoid=${options.avoid.map((av) => av.toLowerCase()).join('|')}`
    );
  }

  if (typeof options.mode === 'string' && options.mode.trim() !== '') {
    query.push(`mode=${options.mode.toLowerCase()}`);
  }

  if (typeof options.language === 'string' && options.language.trim() !== '') {
    query.push(`language=${options.language}`);
  }

  if (typeof options.region === 'string' && options.region.trim() !== '') {
    query.push(`region=${options.region}`);
  }

  if (
    typeof options.timePrecision === 'string' &&
    options.timePrecision.trim() !== ''
  ) {
    query.push(`departure_time=${options.timePrecision.trim()}`);
  }

  if (typeof options.channel === 'string' && options.channel.trim()) {
    query.push(`channel=${options.channel}`);
  }

  if (query.length) {
    url += `?${query.join('&')}`;
  }

  return url;
};
