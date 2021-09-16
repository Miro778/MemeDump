import React from 'react'
import { addVote } from '../reducers/memeReducer'
import { useDispatch } from 'react-redux'

const Meme = ({ meme }) => {

  const dispatch = useDispatch()

  const memeStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={memeStyle}>
      <div>
        <h1>{meme.title}</h1>
        <p>{meme.media}</p>
        <p>{meme.likes} likes</p>
        <button onClick={() => {
          dispatch(addVote(meme.id,meme))
          window.location.reload()
        }}>upvote</button>
        <p>Added by{meme.user.name}</p>
      </div>
    </div>
  )
}


export default Meme