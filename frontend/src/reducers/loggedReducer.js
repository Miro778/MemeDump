
const loggedReducer = (state = null, action) => {
    switch (action.type) {
    case 'LOGIN':
      state = action.data
      return state
    case 'LOGOUT':
      state = null
      return state
    default:
      return state
    }
  }
  
  export const logIn = (user) => {
    return async dispatch => {
      dispatch({
        type: 'LOGIN',
        data: user,
      })
    }
  }
  
  export const logOut = () => {
    return async dispatch => {
      dispatch({
        type: 'LOGOUT'
      })
    }
  }
  
  export default loggedReducer