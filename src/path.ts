import * as path from 'path';

export const filesDir = path.join(__dirname, '../public');
export const synthtsDir = '/usr/share/synthts';
export const lexFile = path.join(synthtsDir, 'dct/et.dct');
export const lexdFile = path.join(synthtsDir, 'dct/et3.dct');
export const voiceFile = path.join(synthtsDir, 'htsvoices/eki_et_tnu.htsvoice');

export const swaggerFile: string = path.join(__dirname, '../swagger.yml');
