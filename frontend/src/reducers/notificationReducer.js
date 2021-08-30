
const notificationReducer = (state = '', action) => {
    console.log('action: ' , action)
    switch (action.type) {
    case 'CREATED':
      state = `${action.data.content}`
      return state
    case 'ZERO':
      state = ''
      return state
    default:
      return state
    }
  }
  
  export const setNotification = (content,duration) => {
    console.log('content: ' , content)
    return async dispatch => {
      dispatch({
        type: 'CREATED',
        data: { content }
      })
      setTimeout(() => {
        dispatch({
          type: 'ZERO'
        })
      }, duration*1000)
    }
  }
  
  export default notificationReducer