import { Request, Response } from 'express';
import { hostname } from 'os';
import { MONOCHART_APP_VERSION } from '../config';

export default async (req: Request, res: Response) => {
  res.send(`ok:${+new Date()}[${hostname()}][${MONOCHART_APP_VERSION}]`);
};
