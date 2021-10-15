import { CREATE, UPDATE } from '../actions/userActions';

const userReducer  = (state = {}, action) => {
    switch (action.type) {
      case CREATE: 
        return {...state, ...action.payload};
      case UPDATE: 
        return { ...state, ...action.payload }
      default: return state;
    }
}

export default userReducer;