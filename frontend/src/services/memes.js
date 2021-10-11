import axios from 'axios'
const baseUrl = '/api/memes'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = (id, newObject) => {
  const request = axios.put(`/api/memes/${id}`, newObject)
  return request.then(response => response.data)
}

const remove = (id) => {
  const config = {
    headers: { Authorization: token },
  }

  const request = axios.delete(`/api/memes/${id}`,config)
  return request.then(response => response.data)
}

const vote = async (meme) => {
  const votedMeme = {
    ...meme,
    likes: meme.likes + 1
  }
  const response = await axios.put(`${baseUrl}/${meme.id}`, votedMeme)
  return response.data
}

const addComment = async (meme, comment) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(`${baseUrl}/${meme.id}/comments`, comment, config)
  return response.data
}

const exportedObject = {
  getAll,
  create,
  update,
  setToken,
  remove,
  vote,
  addComment
}

export default exportedObject