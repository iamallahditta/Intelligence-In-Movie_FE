

export const uploadAudioFile = async (mp3Blob) => {
  const formData = new FormData();
  formData.append('audio', mp3Blob, 'audio.mp3'); // Add blob with filename

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/api/upload-audio`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Failed to upload audio');

    const data = await response.json(); // { id, extension, url }
    console.log('Uploaded audio data:', data);
    return data; // Return response with audio info (id, url, etc.)
  } catch (error) {
    console.error('Error uploading audio:', error);
    throw error;
  }
};




