import { useState, useEffect } from 'react'
import { Post } from '../components/Content'
import { Box } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

interface UserInfo {
  username: string
  // tambahkan properti lain yang sesuai dengan data userInfo
}

interface HomeProps {
  posts: Post[]
  setPosts: (posts: Post[]) => void
  initialDataFetched: boolean
}

function Home({ posts, setPosts, initialDataFetched }: HomeProps) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState('')
  const [isUnpublishDialogOpen, setIsUnpublishDialogOpen] = useState(false)

  useEffect(() => {
    // Mengambil data dari localStorage saat komponen dimuat
    const userInfoString = localStorage.getItem('userInfo')
    if (userInfoString) {
      const parsedUserInfo: UserInfo = JSON.parse(userInfoString)
      setUserInfo(parsedUserInfo)
    }
  }, [])

  async function handleUnPostNote(noteId: string) {
    setLoading('wait...')
    const auth_token = sessionStorage.getItem('authToken') || ''

    if (!auth_token) {
      // Handle the case where auth_token is not available
      console.error('authToken not found in sessionStorage')
      return
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/unpostNote`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ auth_token, noteId }),
        },
      )

      if (response.ok) {
        const data = await response.json()
        setPosts(data)
        setLoading('')
        // Handle the response data as needed
      } else {
        setLoading('')
        console.error('Failed to unpost note:', response.statusText)
      }
    } catch (error) {
      setLoading('')
      console.error('An error occurred while unposting note:', error)
    }
  }

  const openUnpublishDialog = () => {
    setIsUnpublishDialogOpen(true)
  }

  const closeUnpublishDialog = () => {
    setIsUnpublishDialogOpen(false)
  }

  return initialDataFetched === false ? (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
      }}
    >
      <CircularProgress />
    </div>
  ) : (
    <div style={{ width: '100%' }}>
      <h1>Posts</h1>
      {posts.map((post, i) => (
        <Box
          key={i}
          sx={{
            borderBottom: '1px solid gray',
            marginBottom: '4em',
            padding: { xs: '0', md: '1em' },
          }}
        >
          username :
          <label
            style={{ fontWeight: 'bold', textShadow: '1px 1px 1px black' }}
          >
            {' '}
            {post.username}
          </label>
          <div className="note-container">
            <input
              type="text"
              placeholder="Note title"
              name="note_title"
              value={post.note_title}
              readOnly
            />
            <div className="note-content">
              <textarea
                id="note"
                placeholder="Type your note."
                name="note"
                value={post.note}
                rows={10}
                readOnly
              />
            </div>
            {userInfo?.username === post.username ? (
              loading ? (
                <button type="button" className="post">
                  <div>
                    <CircularProgress />
                  </div>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => openUnpublishDialog()}
                    className="post"
                  >
                    Unpublish
                  </button>
                  <Dialog
                    open={isUnpublishDialogOpen}
                    onClose={closeUnpublishDialog}
                  >
                    <DialogTitle>Confirmation</DialogTitle>
                    <DialogContent>
                      Are you sure you want to unpublish this note from the
                      public?
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={closeUnpublishDialog}>Cancel</Button>
                      <Button
                        onClick={() => {
                          closeUnpublishDialog()
                          handleUnPostNote(post.note_id)
                        }}
                      >
                        Unpublish
                      </Button>
                    </DialogActions>
                  </Dialog>
                </>
              )
            ) : (
              ''
            )}
          </div>
        </Box>
      ))}
    </div>
  )
}

export default Home
