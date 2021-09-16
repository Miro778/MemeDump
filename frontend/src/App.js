import React, { useState, useEffect } from 'react'
import MemeInfo from './components/MemeInfo'
import Login from './components/Login'
import memeService from './services/memes'
import loginService from './services/login'
import './index.css'
import { setNotification } from './reducers/notificationReducer'
import { logIn, logOut } from './reducers/loggedReducer'
import { initializeMemes } from './reducers/memeReducer'
import { useSelector, useDispatch } from 'react-redux'
import User from './components/User'
import {
  BrowserRouter as Router,
  Switch, Route, Link } from 'react-router-dom'
import Container from '@material-ui/core/Container'
import { TableContainer, Table, TableCell, TableRow, TableBody, Paper, TextField, Button, AppBar, Toolbar, IconButton, makeStyles, ImageListItem, ImageList, ImageListItemBar, Avatar, createTheme, ThemeProvider } from '@material-ui/core'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import { Alert } from '@material-ui/lab'
import { green, orange } from '@material-ui/core/colors'

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

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
        </IconButton>
        <Button color="inherit" component={Link} to="/top">
          Top
        </Button>
        <Button color="inherit" component={Link} to="/fresh">
          Fresh
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
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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
  })

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
  }))

  const classes = useStyles()

  function compareByLikes( a, b ) {
    if ( a.likes > b.likes ){
      return -1
    }
    if ( a.likes < b.likes ){
      return 1
    }
    return 0
  }

  // parse a date in yyyy-mm-dd format
  function parseDate(input) {
    var parts = input.match(/(\d+)/g)

    return new Date(parts[0], parts[1]-1, parts[2])
  }

  function compareByDate( a, b ) {
    var date1 = parseDate(a.date)
    var date2 = parseDate(b.date)

    if ( date1.getTime() > date2.getTime() ){
      return -1
    }
    if ( date1.getTime() < date2.getTime() ){
      return 1
    }
    return 0
  }

  const TopRatedMemeList = () => {

    memes.sort( compareByLikes )

    return (
      <ImageList rowHeight={180} className={classes.imageList}>
        {memes.map(meme =>
          <ImageListItem key={meme.id} cols={2} style={{ height: 'auto' }}>
            <img src={meme.media} alt={meme.title} />
            <ImageListItemBar
              title={<span><Link to={`../memes/${meme.id}`}>{meme.title}</Link></span>}
              subtitle={<span>by {meme.user.username} on {meme.date}</span>}
              actionIcon={
                <IconButton aria-label={'Like'} className={classes.icon}>
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

  const MostRecentMemeList = () => {

    memes.sort( compareByDate )

    return (
      <ImageList rowHeight={180} className={classes.imageList}>
        {memes.map(meme =>
          <ImageListItem key={meme.id} cols={2} style={{ height: 'auto' }}>
            <img src={meme.media} alt={meme.title} />
            <ImageListItemBar
              title={<span><Link to={`../memes/${meme.id}`}>{meme.title}</Link></span>}
              subtitle={<span>by {meme.user.username} on {meme.date}</span>}
              actionIcon={
                <IconButton aria-label={'Like'} className={classes.icon}>
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

  if (user === null) {
    return (
      <Login dispatch={dispatch} username={username} setUsername={setUsername} password={password} setPassword={setPassword} errorMessage={errorMessage} handleLogin={handleLogin}
        setErrorMessage={setErrorMessage} setNotification={setNotification} noteMessage={noteMessage} Notification={Notification} user={user}/>
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
            <Route path="/top">
              <TopRatedMemeList />
            </Route>
            <Route path="/fresh">
              <MostRecentMemeList />
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

export default App
