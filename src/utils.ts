// returns a random string of a given length
function createRandomString(length: number) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}


// returns a random id and the extension of the fileName
export function getRandomIdAndExtension(fileName: string) {
  const dotIndex = fileName.lastIndexOf('.')
  const extension = dotIndex !== -1 ? fileName.substring(dotIndex) : '.ERROR'
  if (dotIndex === -1) {
    console.error('ERROR', 'Could not find extension for file', fileName)
  }
  return {
    id: createRandomString(8),
    extension,
  }
}