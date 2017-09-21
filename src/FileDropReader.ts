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

function readItem(item: DataTransferItem): Promise<File[][]> {
  // https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem/webkitGetAsEntry
  const entry = item.webkitGetAsEntry();

  // If it's only a file, convert it to an array of array of files.
  if (entry.isFile) {
    return getFile(entry).then(file => ([[file]]));
  }

  return getFilesFromDirectoryEntry(entry);
}

export default function readDroppedItems(itemList: DataTransferItemList): Promise<File[][]> {
  const items = Array.from(itemList)
    .filter(item => item.webkitGetAsEntry())
    .map(readItem);

  // At this point, there we have an array which is 3 levels deep.
  // * Top level is the user's selection which they dropped.
  //   * Next is a grouping of collections by directory
  //     * Finally, the array of files in that directory.
  return Promise.all(items).then((groups: File[][][]) => {
    return groups.reduce((collections: File[][], collection: File[][]) => {
      return collections.concat(collection);
    }, []);
  });
}
