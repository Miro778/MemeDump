import React, { useState } from 'react'
import { useParams,Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import userService from '../services/users'

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

const User = ({ users, memes }) => {

  const logged = useSelector(state => state.loggedIn)

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

    const handleOpen = () => {
      setOpen(true)
    }

    const handleClose = () => {
      setOpen(false)
    }

    const replaceAvatar = async (event) => {
      event.preventDefault()

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
            <form onSubmit={replaceAvatar}>
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
      <p>Joined in {user.joined}</p>
      <h2>Added memes</h2>
      {theseMemes.map(meme =>
        <p><Link to={`../memes/${meme.id}`}>{meme.title}</Link></p>
      )}
    </div>
  )

  if (user) return (
    <div>
      <img alt="null" src={user.avatar} width="300" height="300"/>
      <h1>{user.username}</h1>
      <p>Joined in {user.joined}</p>
      <h2>Added memes</h2>
      {theseMemes.map(meme =>
        <p><Link to={`../memes/${meme.id}`}>{meme.title}</Link></p>
      )}
    </div>
  )
}


export default User