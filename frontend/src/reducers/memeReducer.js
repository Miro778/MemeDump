import memeService from '../services/memes'

const memeReducer = (state = [], action) => {
  switch (action.type) {
  case 'NEW_MEME':
    console.log('action.data: ' , action.data)
    return [...state, action.data]
  case 'INIT_MEMES':
    return action.data
  case 'VOTE':
    const id = action.data.id
    const memeToChange = state.find(n => n.id === id)
    const changedMeme = {
      ...memeToChange,
      votes: memeToChange.votes + 1
    }
    return state.map(meme =>
      meme.id !== id ? meme : changedMeme
    )
    case 'COMMENT':
      console.log('action.data: ' , action.data)
      return [...state, action.data]
  default:
    return state
  }
}
export const addVote = (id,meme) => {
  return async dispatch => {
    await memeService.vote(meme)
    dispatch({
      type: 'VOTE',
      data: { id }
    })
  }
}

export const addComment = (meme,comment) => {
  return async dispatch => {
    const newComment = await memeService.addComment(meme, comment)
    dispatch({
      type: 'COMMENT',
      data: newComment
    })
  }
}

export const createMeme = content => {
  return async dispatch => {
    const newMeme = await memeService.create(content)
    dispatch({
      type: 'NEW_MEME',
      data: newMeme
    })
  }
}

export const initializeMemes = () => {
  return async dispatch => {
    const memes = await memeService.getAll()
    dispatch({
      type: 'INIT_MEMES',
      data: memes,
    })
  }
}

export default memeReducer