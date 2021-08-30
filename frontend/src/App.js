import React, { useState, useEffect } from 'react'
import Meme from './components/Meme'
// import MemeInfo from './components/MemeInfo'
// import User from './components/User'
import memeService from './services/memes'
import loginService from './services/login'
import './index.css'
import PropTypes from 'prop-types'
import { setNotification } from './reducers/notificationReducer'
import loggedReducer, { logIn, logOut } from './reducers/loggedReducer'
import { initializeMemes,createMeme } from './reducers/memeReducer'
import { useSelector, useDispatch } from 'react-redux'
import {
  BrowserRouter as Router,
  useRouteMatch, useHistory,
  Switch, Route, Link, useParams
} from 'react-router-dom'
import Container from '@material-ui/core/Container'
import { TableContainer, Table, TableCell, TableRow, TableBody, Paper, TextField, Button, AppBar, Toolbar, IconButton } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

const App = () => {

  const [newTitle, setNewTitle] = useState('')
  const [newMedia, setNewMedia] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const dispatch = useDispatch()
  const noteMessage = useSelector(state => state.notification)
  const memes = useSelector(state => state.memes)
  const users = useSelector(state => state.users)

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

  console.log(`Memes: ${memes}`)


  return (
    <Container>
    <Router>

      <h2>MemeDump</h2>
    <Route path="/memes">
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {memes.map(meme =>
            <TableRow key={meme.id}>
              <TableCell>
                <p><Link to={`../memes/${meme.id}`}>{meme.title}</Link></p>
              </TableCell>
              <TableCell>author: {meme.author}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </Route>
  </Router>
  </Container>
   )
}

export default App;
