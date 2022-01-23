import Config from 'react-native-config';
console.log('dupa', Config);

const config = {
  api: {
    host: Config.API_HOST,
  },
};

const API_HOST = config.api.host;

export {API_HOST};

export default config;
