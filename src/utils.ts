// returns a random string of a given length
function createRandomString(length: number) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}


// returns a file name with an id (8 chars) and the original extension (.png)
export function getRandomFileName(name: string) {
  const dotIndex = name.lastIndexOf('.')
  const extension = dotIndex !== -1 ? name.substring(dotIndex) : '.ERROR'
  if (dotIndex === -1) {
    console.error('ERROR', 'Could not find extension for file', name)
  }
  return createRandomString(8) + extension
}