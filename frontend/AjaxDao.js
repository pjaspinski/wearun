import config from './config';

export const fetchFromApi = async (url, options) => {
  return await fetch(`${config.api.host}/${url}`, options);
};

export const fetchFromApiWithAuth = async (state, url, options) => {
  const newOptions = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${state.auth_token}`,
    },
  };

  return await fetchFromApi(url, newOptions);
};

export const buildImageUrl = uri => {
  return `${config.api.host}${uri}`;
};
