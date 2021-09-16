import { React, useState } from 'react'
import { useDispatch } from 'react-redux'
import { addVote } from '../reducers/memeReducer'
import { TextField, Button } from '@material-ui/core'
import memeService from '../services/memes'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'

const MemeInfo = ({ memes }) => {

  const [newComment, setNewComment] = useState('')
  const [disable, setDisable] = useState(false)

  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: '36ch',
    },
    inline: {
      display: 'inline',
    },
  }))

  const classes = useStyles()

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

  const addComment = async (event) => {
    event.preventDefault()
    const commentObject = {
      content: newComment
    }

    memeService
      .addComment(meme,commentObject)
      .then(returnedMeme => {
        console.log(`A new comment '${commentObject.content}' being added`)
        setNewComment('')
      })
    window.location.reload()
  }

  return (
    <div>
      <h1>{meme.title}</h1>
      <img alt="null" src={meme.media}/>
      <p>{meme.likes} likes <Button disabled={disable} variant="contained" color="primary" onClick={() => {
        setDisable(true)
        dispatch(addVote(meme.id,meme))
      }}>like</Button></p>
      <p>added by {meme.user.username}</p>
      <h2>Comments</h2>
      <List className={classes.root}>
        {comments.map(comment =>
          <ListItem alignItems="flex-start">

            <ListItemAvatar>
              <Avatar src={comment.avatar} />
            </ListItemAvatar>
            <ListItemText
              primary={comment.content}
              secondary={
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary"
                >
                  {comment.user} , {comment.date}
                </Typography>
              }
            />
            <Divider variant="inset" component="li" />
          </ListItem>

        )}

      </List>
      <div>
        <form onSubmit={addComment}>
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
    </div>
  )
}


export default MemeInfo