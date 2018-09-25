import { Request, Response } from 'express';
import { publicUrl } from '../config';
import synth from '../synth';

export default async (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'missing text' });
  }

  let urlAndMeta;
  try {
    urlAndMeta = await synth(publicUrl, text, req.body);
  } catch (e) {
    return res.status(500).json({ error: 'internal error' });
  }

  res.json({
    url: urlAndMeta.url,
    meta: urlAndMeta.meta,
  });
};
