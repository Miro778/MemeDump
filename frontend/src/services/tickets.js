import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/tickets'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const postTicket = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const exportedObject = {
  setToken,
  postTicket
}

export default exportedObject