import config from './config.json'
import { io } from 'socket.io-client';
// "undefined" means the URL will be computed from the `window.location` object
const {BASE_URL,SOCKET_PATH}=config
const URL = BASE_URL

export const socket = io(URL,{path:SOCKET_PATH});