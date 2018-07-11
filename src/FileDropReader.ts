import FileCollection from './FileCollection';

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
  return collection.reduce((result: T[], collectionArray: T[]) => {
    return result.concat(collectionArray);
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

function getFilesFromDirectoryEntry(entry: FileSystemEntry, collections: FileCollection[] = []):
Promise<FileCollection[]> {
  const directoryName = getDirectoryName(entry.fullPath);
  return new Promise((resolve) => {
    entry.createReader().readEntries((entries: FileSystemEntry[]) => {
      // Split files and directories apart.
      const parts = partition(entries, (singleEntry) => singleEntry.isFile);

      // Once all the initial files have been read, add them to the collections
      // array and start reading directories.
      Promise.all(parts[0].map(getFile)).then((files: File[]) => {
        const fileCollection: FileCollection = {
          name: directoryName,
          files,
        };
        collections.push(fileCollection);
        // Recursively read directories.
        const directories = parts[1].map((singleEntry) => getFilesFromDirectoryEntry(singleEntry, collections));
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

function getDirectoryName(fullPath: string): string {
  const pathPieces = fullPath.split('/');
  return pathPieces[pathPieces.length - 1] || '';
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
  const start = Date.now();
  return new Promise((resolve) => {
    const reader = new FileReader();

    // Resolve promise when the reader finishes.
    reader.onload = () => {
      console.info(`Read took ${Date.now() - start} milliseconds`);
      resolve(reader.result as string);
    };

    // Start reader.
    reader.readAsDataURL(file);
  });
}

export function readDroppedItems(itemList: DataTransferItemList): Promise<FileCollection[]> {
  // https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem/webkitGetAsEntry
  const entries = Array.from(itemList)
    .map((item) => item.webkitGetAsEntry())
    .filter((entry) => !!entry);

  const [files, dirs] = partition(entries, (entry: FileSystemEntry) => entry.isFile);

  return Promise.all([
    Promise.all(files.map(getFile)),
    Promise.all(dirs.map((entry) => getFilesFromDirectoryEntry(entry))),
  ]).then((result) => {
    const looseFiles: File[] = result[0];
    const groups: FileCollection[][] = result[1];

    // At this point, there we have an array which is 3 levels deep.
    // * Top level is the user's selection which they dropped.
    //   * Next is a grouping of collections by directory
    //     * Finally, the array of files in that directory.
    const collections = flattenOnce(groups);

    // Add loose files to the front.
    if (looseFiles.length) {
      collections.unshift({
        name: '',
        files: looseFiles,
      });
    }

    return collections;
  });
}
