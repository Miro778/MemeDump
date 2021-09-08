import { React, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Meme from './Meme'
import { addVote, addComment } from '../reducers/memeReducer'
import { TextField, Button } from '@material-ui/core'

const User = ({ memes }) => {

  const [newComment, setNewComment] = useState('')

  const dispatch = useDispatch()
  const id = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1)
  console.log('finding by id: ' , id)
  let meme = memes[0]

  console.log('finding from memes: ' , memes)

  for (var i = 0;i < memes.length;i++)
  {
    if (id === memes[i].id) {
      meme = memes[i]
      break
    }
  }

  if (!meme) {
    return null
  }

  const comments = meme.comments
  console.log('comments of this meme: ' , comments)

  return (
    <div>
      <h1>{meme.title}</h1>
      <img src={meme.media}/>
      <p>{meme.likes} likes <button onClick={() => {
        dispatch(addVote(meme.id,meme))
        window.location.reload()
      }}>like</button></p>
      <p>added by {meme.user.username}</p>
      <h2>Comments</h2>
      <div>
      <form onSubmit={
          dispatch(addComment(meme,newComment))
      }>
          <div>
            <TextField label="Comment"
              id='commentField'
              type="text"
              value={newComment}
              name="Comment"
              onChange={({ target }) => setNewComment(target.value)}
            />
          </div>
          <Button variant="contained" color="primary" id='submitMeme-button' type="submit">Add a comment</Button>
        </form>
        </div>
      {comments.map(comment =>
        <p>{comment.content}</p>
      )}
    </div>
  )
}


export default User