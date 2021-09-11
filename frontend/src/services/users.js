import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/users'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const updateAvatar = (user, newAvatar) => {

  const updatedUser = {
    ...user,
    avatar: newAvatar
  }
  const request = axios.put(`http://localhost:3003/api/users/${user.id}`, updatedUser)
  return request.then(response => response.data)
}

export default { getAll, updateAvatar}