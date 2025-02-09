export const generateBase64FromImage = (imageFile) => {
  const reader = new FileReader();
  const promise = new Promise((resolve, reject) => {
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (err) => reject(err);
  });

  reader.readAsDataURL(imageFile);
  return promise;
};

export const handlePostInput = async (value, files, cbPreview, cbImage) => {
  try {
    if (files && files[0]) {
      const file = files[0];

      const b64 = await generateBase64FromImage(file);
      if (cbPreview) cbPreview(b64);
      if (cbImage) cbImage(file);
    } else {
      console.error("No file selected.");
    }
  } catch (error) {
    console.error(error);
  }
};

export const copyToClipboard = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => alert("Copied to clipboard!"))
    .catch((err) => console.error("Failed to copy:", err));
};
