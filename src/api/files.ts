import * as express from 'express';
import { filesDir } from '../path';

export default express.static(filesDir);
