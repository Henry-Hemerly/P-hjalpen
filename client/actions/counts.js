
import { COUNTER_CHANGE, PARKED_POS_CHANGE } from '../constants';

export function changeCount(isParked) {
  return {
    type: COUNTER_CHANGE,
    payload: isParked
  }
}

export function changeParkedPos(parkedPosition) {
  return {
    type: PARKED_POS_CHANGE,
    payload: parkedPosition
  }
}