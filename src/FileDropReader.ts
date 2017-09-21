// https://wicg.github.io/entries-api/#api-directoryreader
interface FileSystemDirectoryReader {
  readEntries(successCallback: (entries: FileSystemEntry[]) => void, errorCallback?: () => void): void;
}

// https://developer.mozilla.org/en-US/docs/Web/API/FileSystemEntry
interface FileSystemEntry {
  readonly filesystem: any;
  readonly fullPath: string;
  readonly isDirectory: boolean;
  readonly isFile: boolean;
  readonly name: string;
  createReader(): FileSystemDirectoryReader;
  file(callback: (file: File) => void): void;
}

/**
 * Does the same thing as lodash's _.partition
 */
function partition<T>(collection: T[], predicate: (item: T) => boolean): T[][] {
  const truthy: T[] = [];
  const falsy: T[] = [];
  collection.forEach((item: T) => {
    if (predicate(item)) {
      truthy.push(item);
    } else {
      falsy.push(item);
    }
  });
  return [truthy, falsy];
}

/**
 * Flatten an array, but only a single level deep.
 */
function flattenOnce<T>(collection: T[][]): T[] {
  return collection.reduce((result: T[], collection: T[]) => {
    return result.concat(collection);
  }, []);
}

/**
 * Get a File instance from an entry instance.
 */
function getFile(entry: FileSystemEntry): Promise<File> {
  return new Promise((resolve) => {
    entry.file(resolve);
  });
}

function getFilesFromDirectoryEntry(entry: FileSystemEntry, collections: File[][] = []): Promise<File[][]> {
  return new Promise((resolve) => {
    entry.createReader().readEntries((entries: FileSystemEntry[]) => {
      // Split files and directories apart.
      const parts = partition(entries, entry => entry.isFile);

      // Once all the initial files have been read, add them to the collections
      // array and start reading directories.
      Promise.all(parts[0].map(getFile)).then((files) => {
        collections.push(files);
        // Recursively read directories.
        const directories = parts[1].map(entry => getFilesFromDirectoryEntry(entry, collections));
        // Since the collections array is passed as an argument and mutated
        // within this recursive function, we don't care about the resolved
        // promise value for any recursed calls to this function.
        Promise.all(directories).then(() => {
          resolve(collections);
        });
      });
    });
  });
}

function getFileExtension(fileName: string): string {
  const matches = fileName && fileName.match(/\.([^.]+)$/);
  if (matches) {
    return matches[1].toLowerCase();
  }

  return '';
}

const VALID_IMAGE_EXTENSIONS = [
  'bmp',
  'gif',
  'jpeg',
  'jpg',
  'jpe',
  'png',
  'svg',
  'tiff',
  'tif',
  'webp',
  'ico',
];

export function isImageFile(file: File): boolean {
  // Firefox doesn't support the `type` property - it's empty.
  if (file.type && file.type.includes('image/')) {
    return true;
  }

  const extension = getFileExtension(file.name);
  return VALID_IMAGE_EXTENSIONS.includes(extension);
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    // Resolve promise when the reader finishes.
    reader.onload = () => {
      resolve(reader.result as string);
    };

    // Start reader.
    reader.readAsDataURL(file);
  });
}

export function readDroppedItems(itemList: DataTransferItemList): Promise<File[][]> {
  // https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem/webkitGetAsEntry
  const entries = Array.from(itemList)
    .map(item => item.webkitGetAsEntry())
    .filter(entry => !!entry);

  const [files, dirs] = partition(entries, (entry: FileSystemEntry) => entry.isFile);

  return Promise.all([
    Promise.all(files.map(getFile)),
    Promise.all(dirs.map(entry => getFilesFromDirectoryEntry(entry))),
  ]).then((result) => {
    const looseFiles: File[] = result[0];
    const groups: File[][][] = result[1];
    const collections = flattenOnce(groups);
    if (looseFiles.length) {
      collections.unshift(looseFiles);
    }

    return collections;
  });
}
