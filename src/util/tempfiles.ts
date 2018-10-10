import { tempfile, unlink } from '.';

export default class Tempfiles {
  private files: string[];

  constructor(readonly directory: string) {
    this.files = [];
  }

  public async createFile(extension = 'tmp'): Promise<string> {
    const file = await tempfile(this.directory, extension);
    this.files.push(file);

    return file;
  }

  public async createFiles(extensions: string[]): Promise<string[]> {
    const promises = [];

    for (const extension of extensions) {
      const promise = tempfile(this.directory, extension);
      promises.push(promise);
    }

    const files = await Promise.all(promises);
    this.files = this.files.concat(files);

    return files;
  }

  public preserve(filename: string): void {
    const index = this.files.indexOf(filename);

    // tslint:disable:no-bitwise
    if (~index) {
      this.files.splice(index, 1);
    }
  }

  public async cleanup(): Promise<void> {
    const promises = [];
    while (this.files.length) {
      const file = String(this.files.pop());
      promises.push(unlink(file));
    }

    await Promise.all(promises);
  }
}
