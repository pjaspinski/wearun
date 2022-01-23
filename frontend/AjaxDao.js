import config from './config';

export const fetchFromApi = async (url, options) => {
  // const auth_headers = state.auth_token
  //   ? {'x-access-token': state.auth_token}
  //   : {};

  return await fetch(`${config.api.host}/${url}`, {
    // headers: {
    //   ...auth_headers,
    //   ...options.headers,
    // },
    ...options,
  });
};
