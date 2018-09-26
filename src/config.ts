const env = process.env;

export const HTTP_PORT = env.PORT || 3382;

export const ROOT_URL: string = String(
  env.ROOT_URL || `http://localhost:${HTTP_PORT}/synth/v1`,
);

export const PUBLIC_URL: string = String(env.PUBLIC_URL || `${ROOT_URL}/files`);

export const STORAGE_DRIVER = String(env.STORAGE_DRIVER);

export const S3_BUCKET = String(env.S3_BUCKET);
export const S3_ENDPOINT = String(env.S3_ENDPOINT);
export const S3_PORT = parseInt(env.S3_PORT as any, 10);
export const S3_USE_SSL = S3_PORT === 443;
export const S3_ACCESS_KEY = String(env.S3_ACCESS_KEY);
export const S3_SECRET_KEY = String(env.S3_SECRET_KEY);

// MONOCHART_APP_VERSION is present in k8s deployment
export const MONOCHART_APP_VERSION = env.MONOCHART_APP_VERSION || '';

export const HTTP_MAX_POST_SIZE = '50mb';

/**
 * set long timeout to avoid node http server killing connection
 * it can take quite a long time time to make some bigger articles tts
 *
 * Sets the timeout value for sockets,
 * and emits a 'timeout' event on the Server object, passing the socket as an argument, if a timeout occurs.
 *
 * By default, the Server's timeout value is 2 minutes, and sockets are destroyed automatically if they time out.
 * However, if you assign a callback to the Server's 'timeout' event, then you are responsible for handling socket timeouts.
 *
 * @link https://github.com/expressjs/express/issues/3330
 * @link https://nodejs.org/dist/latest-v6.x/docs/api/http.html#http_server_settimeout_msecs_callback
 * @type {number}
 */
export const HTTP_SERVER_TIMEOUT_MSEC = 30 * 60 * 1000;
