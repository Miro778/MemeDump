import React, { useState, useEffect } from 'react'
import MemeInfo from './components/MemeInfo'
import Info from './components/Info'
import Login from './components/Login'
import memeService from './services/memes'
import ticketService from './services/tickets'
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
import Box from '@mui/material/Box'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import ExitToApp from '@material-ui/icons/ExitToApp'
import StarsIcon from '@material-ui/icons/Stars'
import WatchLaterIcon from '@material-ui/icons/WatchLater'
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos'
import PeopleIcon from '@material-ui/icons/People'
import ImageIcon from '@material-ui/icons/Image'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import CommentIcon from '@material-ui/icons/Comment'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import SearchIcon from '@material-ui/icons/Search'
import ClearIcon from '@material-ui/icons/Clear'
import InfoIcon from '@material-ui/icons/Info'

const Menu = (props) => {
  const users = useSelector(state => state.users)
  const username = props.logged.username
  let thisUser = {
    username: '0'
  }

  for (var i = 0;i < users.length;i++)
  {
    if (username === users[i].username) {
      thisUser = users[i]
      break
    }
  }

  return (
    <AppBar position="static">
      <Toolbar style={{ display:'flex', justifyContent:'space-between' }}>
        <div></div>
        <div >
          <Button style={{ marginRight: 10, marginLeft: 100 }} variant="contained" color="inherit" component={Link} to="/top">
            <b>Top</b><StarsIcon style={{ marginLeft: 10 }}/>
          </Button>
          <Button style={{ margin: 10 }} variant="contained" color="inherit" component={Link} to="/fresh">
            <b>Fresh</b><WatchLaterIcon style={{ marginLeft: 10 }}/>
          </Button>
          <Button style={{ margin: 10 }} variant="contained" color="inherit" component={Link} to="/newpost">
            <b>New post</b><AddToPhotosIcon style={{ marginLeft: 10 }}/>
          </Button>
          <Button style={{ margin: 10 }} variant="contained" color="inherit" component={Link} to="/users">
            <b>Users</b><PeopleIcon style={{ marginLeft: 10 }}/>
          </Button>
          <Button style={{ margin: 10 }} variant="contained" color="inherit" component={Link} to={`/users/${thisUser.id}`}>
            <b>My Profile</b><AccountCircleIcon style={{ marginLeft: 10 }}/>
          </Button>
        </div>
        <div>
          <Button color="inherit" component={Link} to="/info">
          Info & Support <InfoIcon style={{ marginLeft: 10 }}/>
          </Button>
          <Button color="inherit" sx={{ display: { xs: 'none', md: 'flex' } }} onClick={props.handleLogout}>Logout <ExitToApp style={{ marginLeft: 10 }}/></Button>
        </div>
      </Toolbar>
    </AppBar>
  )
}

const App = () => {

  const [newTitle, setNewTitle] = useState('')
  const [newMedia, setNewMedia] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [ filter, setFilter] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const dispatch = useDispatch()
  const noteMessage = useSelector(state => state.notification)
  const users = useSelector(state => state.users)
  const memes = useSelector(state => state.memes)
  users.sort( compareByPoints )


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
      ticketService.setToken(user.token)
    }
  },[dispatch])

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

  const logged = useSelector(state => state.loggedIn)

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
      width: 600,
      height: 900,
    },
    icon: {
      color: 'rgba(255, 255, 255, 0.54)',
    },
  }))

  const classes = useStyles()

  const handleFilter = (event) => {
    setFilter(event.target.value)
    console.log('Filter: ' , filter)
  }

  const clearSearch = () => {
    setFilter('')
    console.log('Filter: ' , filter)
  }

  function QuickSearchToolbar() {
    return (
      <div className={classes.root}>
        <TextField
          variant="standard"
          value={filter}
          onChange={handleFilter}
          placeholder="Search…"
          className={classes.textField}
          InputProps={{
            startAdornment: <SearchIcon fontSize="small" />,
            endAdornment: (
              <IconButton
                title="Clear"
                aria-label="Clear"
                size="small"
                onClick={clearSearch}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            ),
          }}
        />
      </div>
    )
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

  function compareByLikes( a, b ) {
    if ( a.likes > b.likes ){
      return -1
    }
    if ( a.likes < b.likes ){
      return 1
    }
    return 0
  }

  function compareByPoints( a, b ) {
    if ( Math.abs(a.memes.length * 3) + getLikes(a) + getComments(a) > Math.abs(b.memes.length * 3) + getLikes(b) + getComments(b) ){
      return -1
    }
    if ( Math.abs(a.memes.length * 3) + getLikes(a) + getComments(a) < Math.abs(b.memes.length * 3) + getLikes(b) + getComments(b) ){
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
      <ImageList className={classes.imageList}>
        {memes.map(meme =>
          <ImageListItem key={meme.id} cols={2} style={{ height: 'auto' }}>
            <img src={meme.media} alt={meme.title} />
            <ImageListItemBar
              title={<span><Link to={`../memes/${meme.id}`}>{meme.title}</Link></span>}
              subtitle={<span>by {meme.user.username} on {meme.date}</span>}
              actionIcon={
                <IconButton aria-label={'Like'} href={`../memes/${meme.id}`} className={classes.icon}>
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
                <IconButton aria-label={'Like'} href={`../memes/${meme.id}`}className={classes.icon}>
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
          <div id='title'>
            <h1>MemeDump</h1>
          </div>
          <div id='loggedInfo' >
            <p>Logged in as: {user.username}</p>
          </div>

          <Notification message={noteMessage} />

          <Box sx={{
            bgcolor: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <Menu handleLogout={handleLogout} logged={logged}/>
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
              <Route path="/info">
                <Info />
              </Route>
              <Route path="/newpost"><NewPost></NewPost></Route>

              <Route path="/users/:id">
                <User users={users} memes={memes} logged={logged}/>
              </Route>

              <Route path="/users">
                <div id='searchBar'>
                  <QuickSearchToolbar />
                </div>
                <TableContainer component={Paper}>
                  <Table>
                    <TableBody>
                      {users.map(user => (
                        user.username.includes(filter)
                          ? (
                            <TableRow key={user.id}>
                              <TableCell>
                                <span><Avatar alt={user.username} src={user.avatar} /><Link to={`../users/${user.id}`}>{user.username}</Link></span>
                              </TableCell>
                              <TableCell><ControlPointIcon />Activity points: {Math.abs(user.memes.length * 3) + getLikes(user) + getComments(user)}</TableCell>
                              <TableCell><ImageIcon />posts: {user.memes.length}</TableCell>
                              <TableCell><ThumbUpIcon />likes received: {getLikes(user)}</TableCell>
                              <TableCell><CommentIcon />comments posted: {getComments(user)}</TableCell>
                              <TableCell><CalendarTodayIcon /> joined in {user.joined}</TableCell>
                            </TableRow>
                          )
                          : null
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Route>
            </Switch>
          </Box>
        </Router>
      </Container>
    </ThemeProvider>
  )
}

export default App
