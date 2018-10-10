import { unlink } from 'fs';
import { promisify } from 'util';

export default promisify(unlink);
