import React, { useState } from 'react'
import './NoteForm.css'
import Alert from '@mui/material/Alert'
import { NoteData } from '../pages/MyNotes'

function NoteForm({
  setNotes,
  noteForm,
  setNoteForm,
}: {
  setNotes: React.Dispatch<React.SetStateAction<NoteData[]>>
  noteForm: boolean
  setNoteForm: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [note, setNote] = useState<string>('')
  const [noteTitle, setNoteTitle] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!noteTitle) {
      setErrorMessage('Please fill in the note title.')
      return
    }

    const authTokenFromSession = sessionStorage.getItem('authToken') ?? ''
    console.log('ini test:', authTokenFromSession)

    const data = {
      note,
      note_title: noteTitle,
      auth_token: authTokenFromSession || '',
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/add-note`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const data = await response.json()
        setNotes(data)
        setNoteForm(!noteForm)
        console.log('Note berhasil diunggah.', data)
        // Handle respons sukses sesuai kebutuhan, misalnya mengarahkan pengguna ke halaman lain
      } else {
        const errorData = await response.json()
        setErrorMessage(errorData.message)
        console.error('Gagal mengunggah note.', errorData.message)
        // Handle respons gagal sesuai kebutuhan
      }
    } catch (error) {
      console.error('Error uploading note:', error)
      // Handle error sesuai kebutuhan
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {/* {isSuccess && <div style={{ color: 'green' }}>{isSuccess}</div>} */}
      <div className="note-container">
        <input
          type="text"
          placeholder="Note title"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
        />
        <div className="note-content">
          <textarea
            id="note"
            placeholder="Type your note."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={10}
          />
        </div>
        <button
          type="button" // Menggunakan type="button" untuk mencegah pengiriman formulir
          onClick={() => setNoteForm(!noteForm)}
          className="cancel"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default NoteForm
