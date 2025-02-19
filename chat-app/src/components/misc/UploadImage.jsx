import { useState } from "react";
import { storage } from "./firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const UploadImage = () => {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");

  const uploadFile = () => {
    if (!image) return;

    const storageRef = ref(storage, `uploads/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log("Uploading...", snapshot.bytesTransferred);
      },
      (error) => console.error(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUrl(downloadURL); // Store this URL in your database
        });
      }
    );
  };

  return (
    <div>
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={uploadFile}>Upload</button>
      {url && <img src={url} alt="Uploaded" width="100" />}
    </div>
  );
};

export default UploadImage;
