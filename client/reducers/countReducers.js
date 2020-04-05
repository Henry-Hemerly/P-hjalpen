import { COUNTER_CHANGE, PARKED_POS_CHANGE, REG_NR_CHANGE, CONNECTION_TO_CAR_CHANGE, REMINDER_INVALID_CHANGE, REMINDER_PAY_CHANGE, REMINDER_STOP_PAY_CHANGE } from '../constants';
const initialState = {
  parked: false,
  parkedPosition: {},
  registrationNumber: "",
  connectedToCar: false,
  reminderInvalidParking: false,
  reminderTopay:false,
  reminderStoppay:false
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
    case REG_NR_CHANGE:
      return {
        ...state,
        registrationNumber: action.payload
      };
    case CONNECTION_TO_CAR_CHANGE:
      return {
        ...state,
        connectedToCar: action.payload
      };
      case REMINDER_INVALID_CHANGE:
        return {
          ...state,
          reminderInvalidParking: action.payload
        };
      case REMINDER_PAY_CHANGE:
        return {
          ...state,
          reminderTopay: action.payload
        };
      case REMINDER_STOP_PAY_CHANGE:
        return {
          ...state,
          reminderStoppay: action.payload
        };
    default:
      return state;
  }
}
export default countReducer;
