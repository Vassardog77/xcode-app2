//ported to react native

const initialState = [];

const notificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATIONS':
      return action.payload;
    case 'SEND_NOTIFICATION':
      // On sending notification, add it to the state
      return [...state, action.payload];
    case 'DELETE_NOTIFICATION':
      // After deletion, set the state as received from payload 
      return action.payload; // assuming the payload is the updated notifications list
    case 'UPDATE_NOTIFICATION':
      return action.payload;
    default:
      return state;
  }
}

export default notificationsReducer;
