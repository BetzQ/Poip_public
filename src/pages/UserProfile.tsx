import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

interface UserProfile {
  name: string
  username: string
  email: string
  Path: string
  following: []
  followers: []
  // Tambahkan field lain yang Anda butuhkan
}
interface UserInfo {
  username: string
  auth_token: string
  following: string[]
  // Tambahkan field lain yang Anda butuhkan
}

function UserProfile() {
  const { username } = useParams<{ username: string }>()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const storedUserInfo = localStorage.getItem('userInfo')
  const initialUserInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null

  const [userInfo] = useState<UserInfo | null>(initialUserInfo)

  useEffect(() => {
    // Fungsi untuk memeriksa apakah data pengguna sudah ada di localStorage
    const checkLocalStorage = () => {
      const usersData = localStorage.getItem('users')
      if (!usersData) {
        // Jika data pengguna belum ada di localStorage, maka lakukan fetch ke endpoint /users
        fetch(`${import.meta.env.VITE_API_URL}/users`)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok')
            }
            return response.json()
          })
          .then((data: UserProfile[]) => {
            // Simpan data pengguna ke localStorage
            localStorage.setItem('users', JSON.stringify(data))
            // Cari pengguna dengan username yang sesuai
            const matchedUser = data.find((user) => user.username === username)
            if (matchedUser) {
              setUserProfile(matchedUser)
            } else {
              throw new Error('User not found')
            }
          })
          .catch((error) => {
            console.error('Error fetching users:', error)
            setError(error)
          })
          .finally(() => {
            setLoading(false)
          })
      } else {
        // Data pengguna sudah ada di localStorage, cari pengguna dengan username yang sesuai
        const parsedUsersData = JSON.parse(usersData)
        const matchedUser = parsedUsersData.find(
          (user: UserProfile) => user.username === username,
        )
        if (matchedUser) {
          setUserProfile(matchedUser)
        } else {
          throw new Error('User not found')
        }
        setLoading(false)
      }
    }

    // Panggil fungsi checkLocalStorage
    checkLocalStorage()
  }, [username])

  const handleFollowButtonClick = async () => {
    const authToken = userInfo?.auth_token;
    const usernameToFollow = userProfile?.username;
  
    fetch(`${import.meta.env.VITE_API_URL}/follow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ authToken, usernameToFollow }),
    })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error('Failed to follow/unfollow user');
      }
      
      const authToken = sessionStorage.getItem('authToken')
      const apiUrl = `${import.meta.env.VITE_API_URL}/get-user-info/${authToken}`
  
      await fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then((data: UserInfo) => {
          // Simpan data pengguna ke localStorage
          localStorage.setItem('userInfo', JSON.stringify(data))
        })
        .catch((err: Error) => {
          setError(err)
          setLoading(false)
        })

      // Refresh halaman setelah follow/unfollow berhasil
      window.location.reload();
    })
    .catch((error) => {
      console.error('Error following/unfollowing user:', error);
    });
  };
  
  

  const userFollowing = userInfo?.following

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (!userProfile) {
    return <div>No user data available.</div>
  }

  return (
    <div>
      <h1>User Profile</h1>
      <div style={{ display: 'flex' }}>
        <img
          src={`${import.meta.env.VITE_API_URL}/uploads/${userProfile.Path}`}
          alt=""
          width={200}
          style={{ marginRight: '1em' }}
        />
        <div>
          <p>Name: {userProfile.name}</p>
          <p>Username: {userProfile.username}</p>
          {userProfile.username === userInfo?.username ||
          !sessionStorage.getItem('authToken') ? (
            ''
          ) : (
            <button onClick={handleFollowButtonClick}>
              {userFollowing?.includes(userProfile?.username)
                ? 'Unfollow'
                : 'Follow'}
            </button>
          )}
        </div>
      </div>
      <p>Following : {userProfile.following.length}</p>
      <p>Followers : {userProfile.followers.length}</p>
    </div>
  )
}

export default UserProfile
