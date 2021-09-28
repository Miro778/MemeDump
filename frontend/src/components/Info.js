/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import ControlPointIcon from '@material-ui/icons/ControlPoint'
import CommentIcon from '@material-ui/icons/Comment'
import ImageIcon from '@material-ui/icons/Image'
import PeopleIcon from '@material-ui/icons/People'
import StarsIcon from '@material-ui/icons/Stars'
import WatchLaterIcon from '@material-ui/icons/WatchLater'
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import ExitToApp from '@material-ui/icons/ExitToApp'
import Button from '@material-ui/core/Button'
import ticketService from '../services/tickets'
import '../index.css'

const Info = () => {

  const [ticketType, setTicketType] = useState('suggestion')
  const [ticketContent, setTicketContent] = useState('')

  const sendTicket = async (event) => {

    const ticketObject = {
      content: ticketContent,
      type: ticketType
    }

    console.log('ticketObject: ' , ticketObject)

    ticketService
      .postTicket(ticketObject)
      .then(returnedTicket => {
        setTicketType('')
        setTicketContent('')
        alert('Your ticket has been submitted.')
      })

  }

  function setType()
  {
    var selectedValue = document.getElementById('types').value
    setTicketType(selectedValue)
  }

  function setContent()
  {
    var selectedValue = document.getElementById('ticketContent').value
    setTicketContent(selectedValue)
  }

  return (
    <div>
      <div>
        <h1>INFO</h1>
      </div>
      <div id='infoBar'>
        <h2>Pages</h2>
        <b>TOP <StarsIcon />:</b>
        <p>Shows the memes starting from the most liked in a descending order. <br />You can access the comment section of the meme by clicking its title.</p>
        <b>FRESH <WatchLaterIcon />:</b>
        <p>Shows the memes starting from the most recently added in a descending order. <br />You can access the comment section of the meme by clicking its title.</p>
        <b>NEW POST <AddToPhotosIcon />:</b>
        <p>Add a new post to the site based on a URL-link and Title you've submitted in the field.</p>
        <b>USERS <PeopleIcon />:</b>
        <p>Shows the list of users and their data. The users are listed starting from the one with most activity points in a descending order. <br />
        You can view the user's profile page by clicking the name on the list. The profile shows you the user's rank, <br />
        the memes the person has added. By clicking the link in the title on that list you can access the page of the meme.</p>
        <b>MY PROFILE <AccountCircleIcon />:</b>
        <p>Leads to your own profile page. You can change your avatar on this page.</p>
        <b>LOGOUT <ExitToApp />:</b>
        <p>Logs you off. By logging off you will have to submit credentials in order to view the site with an account on the next time you enter MemeDump. <br />
        If you exit the site without logging off your user token will be remembered and you will automatically be logged in as the current user <br />
        the next time you enter the site.</p>
      </div>
      <div id='infoBar'>
        <h2>Activity Points <ControlPointIcon /></h2>
        <p>Activity points define the ranking of a user. <br />These points are earned by following activities: </p>
        <p><ImageIcon /> Posting a meme: <b>+3 points</b></p>
        <p><CommentIcon /> Posting a comment: <b>+1 points</b></p>
        <p><ThumbUpIcon /> Receiving a like from a meme: <b>+1 points</b></p>
      </div>
      <div id='infoBar'>
        <h2>Send a ticket</h2>
        <p>In a need to contact the administration? That can be done by sending a ticket here.<br />
         Select a type from 'Suggestion', 'Bug Report' or 'Other issue' and write a description.</p>
        <form onSubmit={sendTicket}>
          <div style={{ marginBottom: 30, marginTop: 20 }}>
            <label for="types">Choose a type for your ticket: </label>
            <select name="types" id="types" onChange={setType}>
              <option value="Suggestion">Suggestion</option>
              <option value="Bug Report">Bug Report</option>
              <option value="Other Issue">Other Issue</option>
            </select>
          </div>
          <div>
            <p>Describe your issue below: </p>
            <textarea rows="4" cols="50" name="ticketContent" type="text" id="ticketContent" onChange={setContent}/>
          </div>
          <div>
            <Button variant="contained" color="primary" id='submitTicket-button' type="submit">Submit</Button>
          </div>
        </form>
      </div>
    </div>

  )
}

export default Info