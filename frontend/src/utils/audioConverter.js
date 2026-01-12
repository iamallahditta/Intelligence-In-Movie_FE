

export const convertOnServer = async (webmBlob) => {
  const formData = new FormData();
  formData.append('audio', webmBlob, 'input.webm');

  const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/api/convert`, {
    method: 'POST',
    body: formData,
  });

  console.log("audio convert response",response)
  const mp3Blob = await response.blob();
  return mp3Blob;
};

