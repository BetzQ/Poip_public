import { Route, Routes, Navigate } from 'react-router-dom'
import Theme from '../pages/Theme'
import { ThemeProps } from '../pages/Theme'
import Home from '../pages/Home'
import Settings from '../pages/Settings'
import Login from '../pages/Login'
import MyNotes, { NoteData } from '../pages/MyNotes'
import { useEffect, useState } from 'react'
import Register from '../pages/Register'

export interface Post {
  user_id: string
  note_id: string
  username: string
  note: string
  note_title: string
}

const initialNotes: NoteData[] = []

function Content(
  props: ThemeProps & {
    setIsLogin: (value: boolean) => void
    isLogin: boolean
  },
) {
  const [posts, setPosts] = useState<Post[]>([])
  const [notes, setNotes] = useState<NoteData[]>(initialNotes)
  const [fetchComplete, setFetchComplete] = useState(false)
  const [authToken] = useState(sessionStorage.getItem('authToken'))
  const [initialDataFetched, setInitialDataFetched] = useState(false)
  useEffect(() => {
    if (!authToken) {
      localStorage.removeItem('userInfo')
      // localStorage.removeItem('users');
    }
  }, [])

    useEffect(() => {
    // Membuat fungsi async untuk mengambil data dari endpoint
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_GETPOSTS}/get-posts`,
        ) // Sesuaikan dengan path endpoint Anda
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const data = await response.json()
        setPosts(data)
        setInitialDataFetched(true)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    // Memanggil fungsi fetchData untuk mengambil data saat komponen dimuat
    if (!initialDataFetched) {
      fetchData()
    }
  }, [initialDataFetched, setPosts])

  useEffect(() => {
    const authTokenFromSession = sessionStorage.getItem('authToken') ?? ''
    if (authTokenFromSession) {
      fetch(`${import.meta.env.VITE_API_GETNOTES}/get-notes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': authTokenFromSession,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then((data) => {
          if (data.length !== 0) {
            setNotes(data)
          }
          setFetchComplete(true)
        })
        .catch((error) => {
          console.error('Error fetching notes:', error)
          setFetchComplete(true) // Set fetchComplete to true even on error
        })
    }
  }, [])

  return (
    <Routes>
      <Route
        path="/login"
        element={
          authToken || props.isLogin ? (
            <Navigate to="/" />
          ) : (
            <Login setIsLogin={props.setIsLogin} />
          )
        }
      />
      <Route
        path="/register"
        element={
          !authToken && !props.isLogin ? <Register /> : <Navigate to="/" />
        }
      />

      <Route
        path="/"
        element={
          <Home
            posts={posts}
            setPosts={setPosts}
            initialDataFetched={initialDataFetched}
          />
        }
      />
      <Route
        path="/mynotes"
        element={
          authToken || props.isLogin ? (
            <MyNotes
              posts={posts}
              setPosts={setPosts}
              fetchComplete={fetchComplete}
              notes={notes}
              setNotes={setNotes}
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="/theme" element={<Theme {...props} />} />
      <Route
        path="/settings"
        element={
          authToken || props.isLogin ? (
            <Settings setPosts={setPosts} posts={posts} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  )
}

export default Content
