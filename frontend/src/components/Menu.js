import React from 'react'
import { useSelector } from 'react-redux'
import { AppBar, Toolbar, Button } from '@material-ui/core'
import ExitToApp from '@material-ui/icons/ExitToApp'
import InfoIcon from '@material-ui/icons/Info'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import PeopleIcon from '@material-ui/icons/People'
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos'
import StarsIcon from '@material-ui/icons/Stars'
import WatchLaterIcon from '@material-ui/icons/WatchLater'
import { Link } from 'react-router-dom'

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

export default Menu


