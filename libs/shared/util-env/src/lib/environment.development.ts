import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
  production: false,

  ROOT_DOMAIN_URL: 'https://sportcaster-api.azurewebsites.net/',
  dataApiUrl: 'https://sportcaster-api.azurewebsites.net/api',
  

  MONGO_DB_CONNECTION_STRING: 'mongodb+srv://admin:admin@cluster0.dxo4r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  
};
