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

const updateAvatarByFile = (user, newAvatarFile) => {
  console.log('newavatarfile: ' , newAvatarFile)

  const request = axios.post('/api/upload', newAvatarFile).then(response => console.log(response)).catch(err => console.log())
  /**
  return request.then(response => response.data)

  const updatedUser = {
    ...user,
    avatar: newAvatarFile
  }
  const request2 = axios.put(`/api/users/${user.id}`, updatedUser)
  return request2.then(response => response.data)
  */
}

const newUser = (user) => {
  const request = axios.post('/api/users', user)
  return request.then(response => response.data)
}

const exportedObject = {
  getAll,
  updateAvatar,
  updateAvatarByFile,
  newUser
}

export default exportedObject