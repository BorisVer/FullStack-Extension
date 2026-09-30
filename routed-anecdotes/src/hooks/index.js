import { useState, useEffect } from "react"
import anecdotesService from "../services/anecdotes"

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    reset,
    input: {
      type,
      value,
      onChange
    }
  }
}


export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    const getAnecdotes = async () => {
      const anecdotes = await anecdotesService.getAll()
      setAnecdotes(anecdotes)
    }
    getAnecdotes()
  }, [])

  const addAnecdote = async (anecdote) => {
    const added = await anecdotesService.createNew(anecdote)
    setAnecdotes([...anecdotes, added])
  }

  return {
    anecdotes,
    addAnecdote
  }
}
