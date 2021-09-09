/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import { useParams,Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Avatar from '@material-ui/core/Avatar';

const User = ({ users }) => {
  if (!users) {
    return null
  }

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

  const memes = useSelector(state => state.memes)

  for (var j = 0;j < memes.length;j++)
  {
    if (id === memes[j].user.id) {
      theseMemes.push(memes[j])
    }
  }

  return (
    <div>
      <Avatar src={user.avatar} />
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