/* eslint-disable no-unused-vars */
import axios from 'axios'
const baseUrl = '/api/users'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const updateAvatar = (user, newAvatar) => {

  const updatedUser = {
    ...user,
    avatar: newAvatar
  }
  const request = axios.put(`/api/users/${user.id}`, updatedUser)
  return request.then(response => response.data)
}

const newUser = (user) => {
  const request = axios.post('/api/users', user)
  return request.then(response => response.data)
}

const exportedObject = {
  getAll,
  updateAvatar,
  newUser
}

export default exportedObject