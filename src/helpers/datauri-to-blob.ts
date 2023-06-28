/**
 * need be 'data:image/png,xxx'
 */
export const dataURIToBlob = (dataURI: string) => {
  const [mimeString, dataString] = dataURI.split(",");
  const type = mimeString.split(":")?.[1]?.split(";")?.[0];
  const buffer = new ArrayBuffer(dataString.length);
  const dataview = new Int8Array(buffer);
  for (let i = 0; i < dataString.length; i++) {
    dataview[i] = dataString.charCodeAt(i);
  }
  return new Blob([buffer], { type });
};
