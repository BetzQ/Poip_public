import { useState } from 'react'
import './mynotes.css'
import NoteForm from '../components/NoteForm'
import Note from '../components/Note' // Pastikan Anda mengimpor komponen Note jika belum melakukannya
import {
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { Post } from '../components/Content'

export type NoteData = {
  _id: string
  user_id: string
  note: string
  note_title: string
}

interface HomeProps {
  posts: Post[]
  setPosts: (posts: Post[]) => void
  fetchComplete: boolean
  notes: NoteData[]
  setNotes: React.Dispatch<React.SetStateAction<NoteData[]>>
}

function MyNotes({
  posts,
  setPosts,
  fetchComplete,
  notes,
  setNotes,
}: HomeProps) {
  const [noteForm, setNoteForm] = useState(false)
  const [selectedNote, setSelectedNote] = useState<NoteData | null>(null)
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null)
  const [loading, setLoading] = useState('')
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)

  const handleNoteClick = (note: NoteData) => {
    setSelectedNote(note)
  }

  const handleDeleteNote = (noteId: string) => {
    setNoteToDelete(noteId)
    setDeleteConfirmationOpen(true)
  }

  const handleConfirmDelete = async () => {
    setLoading('wait...')
    try {
      if (!noteToDelete) return

      const authTokenFromSession = sessionStorage.getItem('authToken') ?? ''

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/delete-note/${noteToDelete}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ auth_token: authTokenFromSession }),
        },
      )

      if (response.ok) {
        setLoading('')
        const data = await response.json()
        setNotes(data.userNotes)
        setPosts(data.postsData)
        setSelectedNote(null)
      }
    } catch (error) {
      setLoading('')
      // Tangani kesalahan jika ada kesalahan dalam kode
      console.error('Error deleting note:', error)
    } finally {
      setLoading('')
      setNoteToDelete(null)
      setDeleteConfirmationOpen(false)
    }
  }

  const handleCancelDelete = () => {
    setNoteToDelete(null)
    setDeleteConfirmationOpen(false)
  }

  const addNote = async (e: React.FormEvent) => {
    setLoading('wait...')
    e.preventDefault()

    const authTokenFromSession = sessionStorage.getItem('authToken') ?? ''

    const sendNote = {
      note: '',
      note_title: '',
      auth_token: authTokenFromSession || '',
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/add-note`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendNote),
      })

      if (response.ok) {
        setLoading('')
        const data = await response.json()
        setNotes(data.userNotes)
        setSelectedNote(data.newNote)

        // Show the success alert
        setShowSuccessAlert(true)

        // Hide the success alert after a delay (e.g., 3 seconds)
        setTimeout(() => {
          setShowSuccessAlert(false)
        }, 6000)
      } else {
        setLoading('')
        const errorData = await response.json()
        console.error('Gagal mengunggah note.', errorData.message)
        // Handle respons gagal sesuai kebutuhan
      }
    } catch (error) {
      setLoading('')
      console.error('Error uploading note:', error)
      // Handle error sesuai kebutuhan
    }
  }

  let content
  if (selectedNote) {
    content = (
      <Note
        note={selectedNote}
        setSelectedNote={setSelectedNote}
        setNotes={setNotes}
        handleDeleteNote={handleDeleteNote}
        posts={posts}
        setPosts={setPosts}
      />
    )
  } else if (!noteForm) {
    if (!fetchComplete) {
      content = (
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
      )
    } else if (notes.length === 0) {
      content = loading ? (
        <CircularProgress />
      ) : (
        <>
          <h4>The user has not created any notes.</h4>
          <Button
            variant="contained" // Variasi tombol, bisa juga "outlined" atau "text"
            sx={{
              background: 'white',
              color: 'black',
              '&:hover': { background: 'rgba(255,255,255,0.9)' },
            }}
            onClick={addNote}
          >
            + Add Note
          </Button>
        </>
      )
    } else {
      content = (
        <>
          {loading ? (
            <CircularProgress />
          ) : (
            <Button
              variant="contained" // Variasi tombol, bisa juga "outlined" atau "text"
              sx={{
                background: 'white',
                color: 'black',
                '&:hover': { background: 'rgba(255,255,255,0.9)' },
              }}
              onClick={addNote}
            >
              + Add Note
            </Button>
          )}
          {notes.map((note, index) => (
            <div
              key={index}
              className="note-card"
              onClick={() => handleNoteClick(note)}
            >
              <p style={{ textShadow: '1px 1px 1px black' }}>
                {note.note_title}
              </p>
              <div
                style={{
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <IconButton
                  size="large"
                  onClick={(e) => {
                    e.stopPropagation() // Menghentikan penyebaran klik ke parent (handleNoteClick)
                    handleDeleteNote(note._id) // Panggil fungsi untuk menghapus catatan
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          ))}
        </>
      )
    }
  } else {
    content = (
      <NoteForm
        setNotes={setNotes}
        noteForm={noteForm}
        setNoteForm={setNoteForm}
      />
    )
  }

  return (
    <Box sx={{ marginLeft: { xs: '0', md: '1em' } }}>
      <h1>Notes</h1>
      {showSuccessAlert && (
        <Alert severity="success">Your note has been successfully added.</Alert>
      )}
      {content}
      <Dialog
        open={deleteConfirmationOpen}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {loading ? loading : 'Are you sure you want to delete this note?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default MyNotes
