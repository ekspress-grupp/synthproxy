import { hostname } from 'os';
import { MONOCHART_APP_VERSION } from '../config';

export default async (req: any, res: any) => {
  res.send(`ok:${+new Date()}[${hostname()}][${MONOCHART_APP_VERSION}]`);
};
