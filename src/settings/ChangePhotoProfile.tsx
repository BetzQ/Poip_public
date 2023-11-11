import React, { useState } from 'react';

function ChangePhotoProfile() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [selectedImageURL, setSelectedImageURL] = useState<string | null>(null);
  const authToken = sessionStorage.getItem('authToken'); // Gantilah dengan cara Anda untuk mendapatkan authToken

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      setSelectedFile(file);
      const imageURL = URL.createObjectURL(file);
      setSelectedImageURL(imageURL);
    } else {
      setSelectedFile(null);
      setSelectedImageURL(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Pilih file terlebih dahulu');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('photo', selectedFile);
      formData.append('auth_token', authToken || '');

      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload-profile-photo`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage('Foto profil berhasil diunggah');
      } else {
        setMessage('Gagal mengunggah foto profil');
        const jsonResponse = await response.json();
  console.log(jsonResponse);
      }
    } catch (error) {
      console.error('Kesalahan pengunggahan foto profil:', error);
      setMessage('Kesalahan Server Internal');
    }
  };

  return (
    <div>
      <h2>Change Photo Profile</h2>
      {selectedImageURL && <img src={selectedImageURL} alt="Selected" width={200} />}
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Unggah Foto Profil</button>
      <p>{message}</p>
    </div>
  );
}

export default ChangePhotoProfile;
