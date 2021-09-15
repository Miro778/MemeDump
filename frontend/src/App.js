import React, { useState, useEffect } from 'react'
import Meme from './components/Meme'
import MemeInfo from './components/MemeInfo'
import memeService from './services/memes'
import userService from './services/users'
import loginService from './services/login'
import './index.css'
import PropTypes from 'prop-types'
import { setNotification } from './reducers/notificationReducer'
import loggedReducer, { logIn, logOut } from './reducers/loggedReducer'
import { initializeMemes,createMeme } from './reducers/memeReducer'
import { useSelector, useDispatch } from 'react-redux'
import User from './components/User'
import {
  BrowserRouter as Router,
  useRouteMatch, useHistory,
  Switch, Route, Link, useParams
} from 'react-router-dom'
import Container from '@material-ui/core/Container'
import { TableContainer, Table, TableCell, TableRow, TableBody, Paper, TextField, Button, AppBar, Toolbar, IconButton, List, Divider, ListItem, ListItemAvatar,
ListItemText, makeStyles, ImageListItem, ImageList, ImageListItemBar, Avatar, createTheme, ThemeProvider } from '@material-ui/core'
import ChatIcon from '@material-ui/icons/Chat';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { Alert } from '@material-ui/lab'
import { green, orange, purple } from '@material-ui/core/colors';
import Modal from '@material-ui/core/Modal';

const modalStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const Menu = (props) => {
  const logged = useSelector(state => state.loggedIn)
  const users = useSelector(state => state.users)
  const username = logged.username
  let thisUser = {
    username: '0'
  }

  for (var i = 0;i < users.length;i++)
  {
    if (username === users[i].username) {
      thisUser = users[i]
      console.log(`Current user: ${thisUser.username}`)
      break
    }
  }

  const padding = {
    padding: 50
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
        </IconButton>
        <Button color="inherit" component={Link} to="/memes">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/newpost">
          New post
        </Button>
        <Button color="inherit" component={Link} to="/users">
          Users
        </Button>
        <Button color="inherit" component={Link} to={`/users/${thisUser.id}`}>
          My profile
        </Button>
        <Button color="inherit" onClick={props.handleLogout}>Logout </Button>
      </Toolbar>
    </AppBar>
  )
}

const App = () => {

  const [newTitle, setNewTitle] = useState('')
  const [newMedia, setNewMedia] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const dispatch = useDispatch()
  const noteMessage = useSelector(state => state.notification)
  const users = useSelector(state => state.users)
  const memes = useSelector(state => state.memes)


  useEffect(() => {
    dispatch(initializeMemes())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedMemeAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      dispatch(logIn(user))
      memeService.setToken(user.token)
    }
  }, [])

  const theme = createTheme({
    palette: {
      primary: {
        main: orange[500],
      },
      secondary: {
        main: green[500],
      },
    },
  });

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedMemeAppUser', JSON.stringify(user)
      )
      memeService.setToken(user.token)
      dispatch(logIn(user))
      setUser(user)
      setUsername('')
      setPassword('')
      dispatch(setNotification(`Welcome '${user.username}'`,5))
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000)
    }

  }

  const handleLogout = async () => {
    console.log('logging out')

    window.localStorage.removeItem('loggedMemeAppUser')
    dispatch(logOut())
    window.location.reload()
  }

  const addMeme = async (event) => {
    event.preventDefault()
    const memeObject = {
      title: newTitle,
      media: newMedia,
      
    }

    memeService
      .create(memeObject)
      .then(returnedMeme => {
        // dispatch(createMeme(memeObject))
        console.log(`A new meme '${newTitle}' being added`)
        dispatch(setNotification(`A new meme '${newTitle}' added`,5))
        setNewTitle('')
      })
      .catch(() => {
        setErrorMessage(
          'An error occurred'
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
      })
  }

  const NewPost = () => {

    return (
      <div>
        <h2>Make a post</h2>
        <form onSubmit={addMeme}>
          <div>
            <TextField label="Title"
              id='titleField'
              type="text"
              value={newTitle}
              name="Title"
              onChange={({ target }) => setNewTitle(target.value)}
            />
          </div>
          <div>     
            <TextField label ="Image link (URL)"
              id='urlField'
              type="text"
              value={newMedia}
              name="Url"
              onChange={({ target }) => setNewMedia(target.value)}
            />
          </div>
          <Button variant="contained" color="primary" id='submitMeme-button' type="submit">create</Button>
        </form>
      </div>
    )
  }

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

  const Notification = ({ message }) => {
    if (message === '') {
      return null
    }

    return (
      <div>
        {(message &&
<Alert severity="success">
  {message}
</Alert>
        )}
      </div>
    )
  }

  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
    },
    imageList: {
      width: 800,
      height: 720,
    },
    icon: {
      color: 'rgba(255, 255, 255, 0.54)',
    },
  }));

  const classes = useStyles();

  const MemeList = (props) => {

    return (
      <ImageList rowHeight={180} className={classes.imageList}>
      {props.sortedMemes.map(meme =>
        <ImageListItem key={meme.id} cols={2} style={{ height: 'auto' }}>
              <img src={meme.media} alt={meme.title} />
              <ImageListItemBar
                title={<span><Link to={`../memes/${meme.id}`}>{meme.title}</Link></span>}
                subtitle={<span>by {meme.user.username} on {meme.date}</span>}
                actionIcon={
                  <IconButton aria-label={`Like`} className={classes.icon}>
                    <ThumbUpIcon />
                    <span> {meme.likes} likes </span>
                  </IconButton> 
                }
              />
        </ImageListItem>
      
      )}
      </ImageList>
    )
  }

    const Sort = () => {

      let sortedMemes = memes

      function compareByLikes( a, b ) {
        if ( a.likes > b.likes ){
          return -1;
        }
        if ( a.likes < b.likes ){
          return 1;
        }
        return 0;
      }

      function compareByComments( a, b ) {
        if ( a.comments.length > b.comments.length ){
          return -1;
        }
        if ( a.comments.length < b.comments.length ){
          return 1;
        }
        return 0;
      }

      function sortChange() {
        if (document.getElementById('box1')) {
      console.log('sort option: ' , document.getElementById('box1').options[document.getElementById("box1").selectedIndex].value);
      var selectedSortOption = document.getElementById('box1').options[document.getElementById("box1").selectedIndex].value
      if (selectedSortOption === 'top rated') sortedMemes.sort( compareByLikes );
      if (selectedSortOption === 'most comments') sortedMemes.sort( compareByComments );
    }
      }

    sortChange()

      return (

        <body>
        <form action="/action_page.php">
  <label for="sort">Sort by:</label>
  <select name="memes" id="box1" onChange={sortChange} >
  <option value="None"> </option>
    <option value="top rated">Top rated</option>
    <option value="most recent">Most recent</option>
    <option value="most comments">Most comments</option>
  </select>
  </form>
      <MemeList sortedMemes={sortedMemes} />
    </body>
      )
    }


    // =================================  Modal Build =================================

    function RegisterModal() {

      function getModalStyle() {
        const top = 50;
        const left = 50;
      
        return {
          top: `${top}%`,
          left: `${left}%`,
          transform: `translate(-${top}%, -${left}%)`,
        };
      }
    
      const classesModal = modalStyles();
      const [modalStyle] = React.useState(getModalStyle);
      const [open, setOpen] = React.useState(false);
      const [newUsername, setNewUsername] = useState('');
      const [newPassword, setNewPassword] = useState('');
    
      const handleOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
    
      const registerUser = async (event) => {
        event.preventDefault()

        let registeringUser = {
          username: newUsername,
          password: newPassword,
          avatar: 'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1223671392?b=1&k=20&m=1223671392&s=612x612&w=0&h=NlD1eNScGYsHBFjAzWrR0JzwkTOvtddTsq-9v5-LryQ='
        }
        
        try {
        userService
        .newUser(registeringUser)
        .then(returnedUser => {
          setUsername('')
          setPassword('')
          dispatch(setNotification(`Succesfully registered a new user with username: '${user.username}'`,5))
        })
          } catch(error) {
          setErrorMessage('An error occured. Make sure that your username and password have at least 3 letters and that your username is unique.')
          setTimeout(() => {
            setErrorMessage(null)
          }, 3000)
          console.log(
            'An error occurred'
          )
        }
        window.location.reload()
      }
      return (
          <div>
          <Button color="primary" variant="contained" onClick={handleOpen}>Register</Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
                <div style={modalStyle} className={classesModal.paper}>
                <form onSubmit={registerUser}>
          <h2 id="simple-modal-title">Set a username and password for your user</h2>
          <div>
          <TextField label="Username"
                  id='usernameField'
                  type="text"
                  value={newUsername}
                  name="Title"
                  onChange={({ target }) => setNewUsername(target.value)}
                />
          </div>
          <div>
          <TextField label="Password"
                  id='passwordField'
                  type="text"
                  value={newPassword}
                  name="Title"
                  onChange={({ target }) => setNewPassword(target.value)}
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
      );
      }
    
      // =================================================================================================

  if (user === null) {
    return (
      <div>
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <Error message={errorMessage} />
          <Notification message={noteMessage} />
          <div>
            <TextField label="username"
              id='username'
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <TextField label="password"
              id='password'
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <Button variant="contained" color="primary" id='login-button' type="submit">Login</Button>
          </form>
          <RegisterModal />
      </div>
    )
  }

  return (
    <ThemeProvider theme={theme}>
    <Container>
    <Router>

    <h1>MemeDump</h1>

    <Notification message={noteMessage} />

    <Menu handleLogout={handleLogout} />
  <Switch>
  <Route path="/memes/:id">
      <MemeInfo memes={memes} />
  </Route>
  <Route path="/memes">
    <Sort />

  </Route>

  <Route path="/newpost"><NewPost></NewPost></Route>
  
  <Route path="/users/:id">
            <User users={users} memes={memes}/>
  </Route>

  <Route path="/users">
  <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  {users.map(user =>
                    <TableRow key={user.id}>
                      <TableCell>
                        <p><Avatar alt={user.username} src={user.avatar} /><Link to={`../users/${user.id}`}>{user.username}</Link></p>
                      </TableCell>
                      <TableCell>posts: {user.memes.length}</TableCell>
                      <TableCell>joined in {user.joined}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
  </Route>
  </Switch>
  </Router>
  </Container>
  </ThemeProvider>
   )
}

export default App;
