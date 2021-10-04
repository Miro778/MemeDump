import userService from '../services/users'
import React, { useState } from 'react'
import Modal from '@material-ui/core/Modal'
import { TextField, Button, makeStyles, Container } from '@material-ui/core'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import '../index.css'

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

const theme = createTheme()

const Login = (props) => {

  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const Error = ({ message }) => {
    if (message === null) {
      return null
    }
    return (
      <div className="error">
        {message}
      </div>
    )
  }

  const registerUser = async (event) => {
    event.preventDefault()

    if (newUsername.length < 3 || newPassword.length < 4 ) {
      window.alert('Cannot register a user with given details. The username must be longer than 2 letters and password longer than 3 letters.')
      return null
    }

    let registeringUser = {
      username: newUsername,
      password: newPassword,
      avatar: 'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1223671392?b=1&k=20&m=1223671392&s=612x612&w=0&h=NlD1eNScGYsHBFjAzWrR0JzwkTOvtddTsq-9v5-LryQ='
    }

    try {
      userService
        .newUser(registeringUser)
        .then(returnedUser => {
          props.setUsername('')
          props.setPassword('')
          props.dispatch(props.setNotification(`Succesfully registered a new user with username: '${props.user.username}'`,5))
        })
    } catch(error) {
      props.setErrorMessage('An error occured. Make sure that your username and password have at least 3 letters and that your username is unique.')
      setTimeout(() => {
        props.setErrorMessage(null)
      }, 3000)
      console.log(
        'An error occurred'
      )
    }
    window.location.reload()
  }

  document.body.style.backgroundColor = 'orange'

  return (
    <ThemeProvider theme={theme}>
      <Container >
        <CssBaseline />
        <Box
          sx={{
            bgcolor: 'white',
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <SentimentVerySatisfiedIcon />
          </Avatar>
          <Typography id="title" component="h1" variant="h5">
            MemeDump
          </Typography>
          <div>
            <h2>Login</h2>

            <Box component="form" onSubmit={props.handleLogin} noValidate sx={{ mt: 1 }}>
              <Error message={props.errorMessage} />
              <props.Notification message={props.noteMessage} />
              <div>
                <TextField label="username"
                  margin="normal"
                  required
                  autoComplete="username"
                  autoFocus
                  id='username'
                  type="text"
                  value={props.username}
                  name="Username"
                  onChange={({ target }) => props.setUsername(target.value)}
                />
              </div>
              <div>
                <TextField label="password"
                  margin="normal"
                  required
                  autoComplete="current-password"
                  id='password'
                  type="password"
                  value={props.password}
                  name="Password"
                  onChange={({ target }) => props.setPassword(target.value)}
                />
              </div>
              <Button
                sx={{ mt: 3, mb: 2 }}
                variant="contained"
                color="primary"
                id='login-button'
                type="submit"
              >Login</Button>
              <RegisterModal registerUser={registerUser} newUsername={newUsername} setNewUsername={setNewUsername} newPassword={newPassword} setNewPassword={setNewPassword}/>
            </Box>
          </div>
        </Box>
      </Container>
    </ThemeProvider>
  )
}


const RegisterModal = (props) => {

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

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Link href="#" variant="body2" sx={{ mt: 3, mb: 2 }} onClick={handleOpen}>{'Don\'t have an account? Sign Up'}</Link>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classesModal.paper}>
          <form onSubmit={props.registerUser}>
            <h2 id="simple-modal-title">Create a new account</h2>
            <div>
              <TextField label="Username"
                id='usernameField'
                type="text"
                value={props.newUsername}
                name="Title"
                onChange={({ target }) => props.setNewUsername(target.value)}
              />
            </div>
            <div>
              <TextField label="Password"
                id='passwordField'
                type="text"
                value={props.newPassword}
                name="Title"
                onChange={({ target }) => props.setNewPassword(target.value)}
              />
            </div>
            <div>
              <Button variant="contained" color="primary" id='submitUser-button' type="submit">Submit</Button>
              <Button variant="contained" color="primary" id='submitUser-button' onClick={handleClose}>Close</Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  )
}

export default Login