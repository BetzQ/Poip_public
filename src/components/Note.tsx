import React, { useState, useEffect } from 'react'
import { NoteData } from '../pages/MyNotes'
import { Post } from './Content'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

type NoteProps = {
  note: NoteData
  setSelectedNote: React.Dispatch<React.SetStateAction<NoteData | null>>
  setNotes: React.Dispatch<React.SetStateAction<NoteData[]>>
  handleDeleteNote: (noteId: string) => void
  posts: Post[]
  setPosts: (posts: Post[]) => void
}

function Note({
  note,
  setSelectedNote,
  setNotes,
  handleDeleteNote,
  posts,
  setPosts,
}: NoteProps) {
  const [updatedNote, setUpdatedNote] = useState({
    note_title: note.note_title,
    note: note.note,
  })
  const [loading, setLoading] = useState('')
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false)
  const [isUnpublishDialogOpen, setIsUnpublishDialogOpen] = useState(false)
  const auth_token = sessionStorage.getItem('authToken') ?? '' // Ganti dengan token otentikasi yang sesuai

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setLoading('sending note...')
    setUpdatedNote({ ...updatedNote, [name]: value })
  }

  const handleUpdateNote = async () => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/update-note`
      const requestBody = {
        note: updatedNote.note,
        note_title: updatedNote.note_title,
        auth_token,
      }

      const response = await fetch(apiUrl + `/${note._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (response.ok) {
        setLoading('')
        const data = await response.json()
        setNotes(data)
        // Perbarui tampilan catatan atau tampilkan pesan sukses
      }
    } catch (error) {
      // Tangani kesalahan jika ada kesalahan dalam kode
    }
  }

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
        console.error('Failed to unpost note:', response.statusText)
      }
    } catch (error) {
      console.error('An error occurred while unposting note:', error)
    }
  }

  // Gunakan useEffect untuk memantau perubahan pada updatedNote dan melakukan pembaruan saat ada perubahan
  useEffect(() => {
    handleUpdateNote()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedNote])

  const handlePostNote = async (noteId: string) => {
    setLoading('wait...')
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/postNote`
      const requestBody = {
        auth_token,
        noteId: noteId, // Menggunakan noteId dari parameter
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (response.ok) {
        const data = await response.json()
        setPosts(data)
        setLoading('')
        // Perbarui tampilan catatan atau tampilkan pesan sukses
      } else {
        const data = await response.json()
        console.log(data)

        // Tangani kesalahan jika permintaan gagal
      }
    } catch (error) {
      // Tangani kesalahan jika ada kesalahan dalam kode
    }
  }

  // Fungsi untuk memeriksa apakah ada posting dengan note_id yang sama
  const isPostExists = () => {
    return posts.some((post) => post.note_id === note._id)
  }

  const openPublishDialog = () => {
    setIsPublishDialogOpen(true)
  }

  const closePublishDialog = () => {
    setIsPublishDialogOpen(false)
  }

  const openUnpublishDialog = () => {
    setIsUnpublishDialogOpen(true)
  }

  const closeUnpublishDialog = () => {
    setIsUnpublishDialogOpen(false)
  }

  return (
    <div className="note-container mynotes">
      <input
        type="text"
        placeholder="Note title"
        name="note_title"
        value={updatedNote.note_title}
        onChange={handleInputChange}
        autoFocus
      />
      <div className="note-content">
        <textarea
          id="note"
          placeholder="Type your note."
          name="note"
          value={updatedNote.note}
          onChange={handleInputChange}
          rows={10}
        />
      </div>
      {loading === 'sending note...' ? (
        <button type="button" className="back">
          {loading}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setSelectedNote(null)}
          className="back"
        >
          Back
        </button>
      )}

      <button
        type="button"
        onClick={() => handleDeleteNote(note._id)}
        className="cancel"
      >
        Delete
      </button>
      {loading === 'wait...' ? (
        <button type="button" className="post">
          {loading}
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={() => {
              if (isPostExists()) {
                openUnpublishDialog()
              } else {
                openPublishDialog()
              }
            }}
            className="publish"
          >
            {isPostExists() ? 'Unpublish' : 'Publish'}
          </button>

          <Dialog open={isPublishDialogOpen} onClose={closePublishDialog}>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent>
              Are you sure you want to publish this note to the public?
            </DialogContent>
            <DialogActions>
              <Button onClick={closePublishDialog}>Cancel</Button>
              <Button
                onClick={() => {
                  closePublishDialog()
                  if (!isPostExists()) {
                    handlePostNote(note._id)
                  }
                }}
              >
                Publish
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog open={isUnpublishDialogOpen} onClose={closeUnpublishDialog}>
            <DialogTitle>Confirmation</DialogTitle>
            <DialogContent>
              Are you sure you want to unpublish this note from the public?
            </DialogContent>
            <DialogActions>
              <Button onClick={closeUnpublishDialog}>Cancel</Button>
              <Button
                onClick={() => {
                  closeUnpublishDialog()
                  if (isPostExists()) {
                    handleUnPostNote(note._id)
                  }
                }}
              >
                Unpublish
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  )
}

export default Note
