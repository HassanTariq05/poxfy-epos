import axios from 'axios';
import {API_BASE_URL} from '../constants';

export const Api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});
