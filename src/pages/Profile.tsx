import { useState, useEffect } from 'react'

interface UserInfo {
  name: string
  username: string
  email: string
  Path: string
  following: []
  followers: []
  // Tambahkan field lain yang Anda butuhkan
}

function Profile() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Jika data tidak ada di localStorage, lakukan permintaan ke server
    const authToken = sessionStorage.getItem('authToken')
    const apiUrl = `${import.meta.env.VITE_API_URL}/get-user-info/${authToken}`

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data: UserInfo) => {
        setUserInfo(data)
        setLoading(false)
        // Simpan data pengguna ke localStorage
        localStorage.setItem('userInfo', JSON.stringify(data))
      })
      .catch((err: Error) => {
        setError(err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (!userInfo) {
    return <div>No user data available.</div>
  }

  return (
    <div>
      <h1>User Profile</h1>
      <div style={{ display: 'flex' }}>
        <img
          src={`${import.meta.env.VITE_API_URL}/uploads/${userInfo.Path}`}
          alt=""
          width={200}
          style={{ marginRight: '1em' }}
        />
        <div>
          <p>Name: {userInfo.name}</p>
          <p>Username: {userInfo.username}</p>
          <p>Email: {userInfo.email}</p>
        </div>
      </div>
      <p>Following : {userInfo.following.length}</p>
      <p>Followers : {userInfo.followers.length}</p>
    </div>
  )
}

export default Profile
