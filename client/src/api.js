import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://magicbrosbackend.azurewebsites.net/',
  withCredentials: true,
});

export default instance;
