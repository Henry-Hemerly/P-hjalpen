import { COUNTER_CHANGE, PARKED_POS_CHANGE } from '../constants';
const initialState = {
  parked: false,
  parkedPosition: {}
};
const countReducer = (state = initialState, action) => {
  switch(action.type) {
    case COUNTER_CHANGE:
      return {
        ...state,
        parked: action.payload
      };
    case PARKED_POS_CHANGE:
      return {
        ...state,
        parkedPosition: action.payload
      };
    default:
      return state;
  }
}
export default countReducer;
