import synth from '../synth';
import { publicUrl } from '../config';

export default async (req: any, res: any) => {
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
