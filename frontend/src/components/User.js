/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { useParams,Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import userService from '../services/users'
import memeService from '../services/memes'
import CommentIcon from '@material-ui/icons/Comment'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import Divider from '@mui/material/Divider'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import IconButton from '@material-ui/core/IconButton'

const modalStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))

const User = ({ users, memes, logged }) => {

  console.log('logged: ' , logged)

  if (users.length < 1) {
    return null
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const id = useParams().id
  let user = users[0]
  let theseMemes = []

  for (var i = 0;i < users.length;i++)
  {
    if (id === users[i].id) {
      user = users[i]
      break
    }
  }

  for (var j = 0;j < memes.length;j++)
  {
    if (id === memes[j].user.id) {
      theseMemes.push(memes[j])
    }
  }

  function getLikes( user ) {

    var likes = 0

    for (var i = 0; i < memes.length; i++) {
      if (memes[i].user.id === user.id) likes = likes + memes[i].likes
    }
    return likes
  }

  function getComments( user ) {

    var comments = 0

    for (var i = 0; i < memes.length; i++) {
      for (var j = 0; j < memes[i].comments.length; j++) {
        if (memes[i].comments[j].user === user.username) comments++
      }
    }
    return comments
  }

  function getRank( user ) {

    for (var i = 0; i < users.length; i++) {
      if (users[i] === user) return i+1
    }
    return users.length-1
  }

  // =================================  Modal Build =================================

  function SimpleModal() {

    function getModalStyle() {
      const top = 50
      const left = 50

      return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
      }
    }

    const classesModal = modalStyles()
    const [modalStyle] = React.useState(getModalStyle)
    const [open, setOpen] = React.useState(false)
    const [newAvatar, setNewAvatar] = useState('')
    const [file, setFile] = useState()
    useEffect( () => { console.log(file) }, [file])

    const handleOpen = () => {
      setOpen(true)
    }

    const handleClose = () => {
      setOpen(false)
    }

    const setAvatarByURL = async (event) => {
      event.preventDefault()

      if (newAvatar.length < 12) {
        window.alert('The URL doesnt seem valid.')
        return null
      }

      userService
        .updateAvatar(user, newAvatar)
        .then(returnedMeme => {
        })
        .catch(() => {
          console.log(
            'An error occurred'
          )
        })
      window.location.reload()
    }

    const setAvatarByFile = async (event) => {
      const data = new FormData()
      data.append('name','name')
      data.append('file', file)
      userService.updateAvatarByFile(user, data)
    }

    return (
      <div>
        <Button color="primary" variant="contained" onClick={handleOpen}>Change Avatar</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div style={modalStyle} className={classesModal.paper}>
            <form onSubmit={setAvatarByURL}>
              <h2 id="simple-modal-title">Submit a new avatar with a link to the image's URL</h2>
              <div>
                <TextField label="Avatar"
                  id='avatarField'
                  type="text"
                  value={newAvatar}
                  name="Title"
                  onChange={({ target }) => setNewAvatar(target.value)}
                />
              </div>
              <div>
                <Button variant="contained" color="primary" id='submitAvatar-button' type="submit">Submit</Button>
              </div>
            </form>
            <h2 id="simple-modal-title">..Or upload a jpg file</h2>
            <form action="http://localhost:3003/api/upload" method="post" enctype="multipart/form-data">
              <div className="flex">
                <label htmlFor="file">File</label>
                <input
                  name="avatar"
                  type="file"
                  id="file"
                  accept=".jpg"
                  multiple
                />
              </div>
              <div>
                <Button variant="contained" color="primary" id='submitAvatar-button' type="submit">Submit</Button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    )
  }

  // =================================================================================================

  if (logged.username === user.username) return (
    <div>
      <div>
        <img alt="null" src={user.avatar} width="300" height="300"/>
      </div>
      <SimpleModal />
      <h1>{user.username}</h1>
      <p>Activity points: {Math.abs(user.memes.length * 3) + getLikes(user) + getComments(user)}, <b>Rank: #{getRank(user)}</b></p>
      <p>Joined in {user.joined}</p>
      <h2>Added memes</h2>
      {theseMemes.map(meme =>
        <div key={meme.id}><p><Link to={`../memes/${meme.id}`}>{meme.title}</Link>
          <IconButton onClick={() => ConfirmMemeDelete(meme.id)} aria-label="delete" size="medium">
            <DeleteForeverIcon fontSize="inherit" />
          </IconButton></p>
        <img src={meme.media} alt="" width="180" height="180"></img>
        <p>{meme.likes} <ThumbUpIcon />    {meme.comments.length} <CommentIcon /></p>
        <Divider /></div>
      )}
    </div>
  )

  if (user) return (
    <div>
      <img alt="null" src={user.avatar} width="300" height="300"/>
      <h1>{user.username}</h1>
      <p>Activity points: {Math.abs(user.memes.length * 3) + getLikes(user) + getComments(user)}, <b>Rank: #{getRank(user)}</b></p>
      <p>Joined in {user.joined}</p>
      <h2>Added memes</h2>
      {theseMemes.map(meme =>
        <div key={meme.id}><p><Link to={`../memes/${meme.id}`}>{meme.title}</Link></p>
          <img src={meme.media} alt="" width="180" height="180"></img>
          <p>{meme.likes} <ThumbUpIcon />    {meme.comments.length} <CommentIcon /></p>
          <Divider /></div>
      )}
    </div>
  )
}

function ConfirmMemeDelete(id)
{
  // eslint-disable-next-line no-restricted-globals
  var confirmation = confirm('Are you sure you want to delete this post?')
  if (confirmation) {
    memeService.remove(id)
    window.location.reload()
    return true
  } else
    return false
}


export default User