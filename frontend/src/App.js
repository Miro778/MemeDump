import React, { useState, useEffect } from 'react'
import Function from './functions'
import Menu from './components/Menu'
import MemeInfo from './components/MemeInfo'
import Info from './components/Info'
import Login from './components/Login'
import Media from './components/MediaType'
import NewPost from './components/NewPost'
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
import { TableContainer, Table, TableCell, TableRow, TableBody, Paper, TextField, IconButton, makeStyles, ImageListItem, ImageList, ImageListItemBar, Avatar, createTheme, ThemeProvider } from '@material-ui/core'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import { Alert } from '@material-ui/lab'
import { green, orange } from '@material-ui/core/colors'
import Box from '@mui/material/Box'
import ImageIcon from '@material-ui/icons/Image'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import CommentIcon from '@material-ui/icons/Comment'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import SearchIcon from '@material-ui/icons/Search'
import ClearIcon from '@material-ui/icons/Clear'


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

  /**
   * Vertailee kahden käyttäjän pisteitä keskenään. Pisteet lasketaan seuraavasti:
   * Käyttäjän meemien lukumäärä * 3
   * + Käyttäjän meemien saamien tykkäysten määrä
   * + Käyttäjän kommenttien määrä
   * @param a ensimmäinen vertailtava objekti
   * @param b toinen vertailtava objekti
   * @returns -1 jos a:n pisteet suuremmat. 1 jos b:n pisteet suuremmat. 0 jos yhtäsuuret.
   */

  function compareByPoints( a, b ) {
    if ( Math.abs(a.memes.length * 3) + Function.getLikes(a, memes) + Function.getComments(a, memes) > Math.abs(b.memes.length * 3) + Function.getLikes(b, memes) + Function.getComments(b, memes) ){
      return -1
    }
    if ( Math.abs(a.memes.length * 3) + Function.getLikes(a, memes) + Function.getComments(a, memes) < Math.abs(b.memes.length * 3) + Function.getLikes(b, memes) + Function.getComments(b, memes) ){
      return 1
    }
    return 0
  }


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

  /**
   * Lähettää loginServicen kautta POST-requestin annetun usernamen ja passwordin mukaan, ja asettaa käyttäjän vastauksen perusteella.
   */
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

  /**
   * Ilmoittaa localStoragelle, että käyttäjä kirjautuu ulos ja vie takaisin kirjautumissivulle.
   */
  const handleLogout = async () => {
    window.localStorage.removeItem('loggedMemeAppUser')
    dispatch(logOut())
    window.location.href = '/'
  }

  /**
   * Luo meemiobjektin newTitlen ja newMedian perusteella, ja lähettää niillä memeServicen avulla POST-requestin.
   */
  const addMeme = async (event) => {
    event.preventDefault()

    if (newTitle === '' || newMedia.length < 5) {
      window.alert('Title or URL missing or not valid.')
      return null
    }

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

  const TopRatedMemeList = () => {

    memes.sort( Function.compareByLikes )

    return (
      <ImageList className={classes.imageList}>
        {memes.map(meme =>
          <ImageListItem key={meme.id} cols={2} style={{ height: 'auto' }}>
            <Media meme={meme} id='mainPageMedia'/>
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

    memes.sort( Function.compareByDate )

    return (
      <ImageList rowHeight={180} className={classes.imageList}>
        {memes.map(meme =>
          <ImageListItem key={meme.id} cols={2} style={{ height: 'auto' }}>
            <Media meme={meme} id='mainPageMedia'/>
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
              <Route path="/newpost"><NewPost addMeme={addMeme} newTitle={newTitle} setNewTitle={setNewTitle} newMedia={newMedia} setNewMedia={setNewMedia}></NewPost></Route>

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
                              <TableCell><ControlPointIcon />Activity points: {Math.abs(user.memes.length * 3) + Function.getLikes(user, memes) + Function.getComments(user, memes)}</TableCell>
                              <TableCell><ImageIcon />posts: {user.memes.length}</TableCell>
                              <TableCell><ThumbUpIcon />likes received: {Function.getLikes(user, memes)}</TableCell>
                              <TableCell><CommentIcon />comments posted: {Function.getComments(user, memes)}</TableCell>
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
