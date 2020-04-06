
import { COUNTER_CHANGE, PARKED_POS_CHANGE, REG_NR_CHANGE, CONNECTION_TO_CAR_CHANGE, REMINDER_INVALID_CHANGE, REMINDER_PAY_CHANGE, REMINDER_STOP_PAY_CHANGE,REMINDER_TIME_CHANGE,INVALID_TIME_SET ,BLUETOOTH_NAME_SET} from '../constants';

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

export function changeRegNumber(regNumber) {
  return {
    type: REG_NR_CHANGE,
    payload: regNumber
  }
}

export function changeCarConnection(isConnected) {
  return {
    type: CONNECTION_TO_CAR_CHANGE,
    payload: isConnected
  }
}

export function changeReminderInvalid(isInvalidReminder) {
  return {
    type: REMINDER_INVALID_CHANGE,
    payload: isInvalidReminder
  }
}

export function changeReminderPay(isPayReminder) {
  return {
    type: REMINDER_PAY_CHANGE,
    payload: isPayReminder
  }
}
export function changeReminderStopPay(isStopPayReminder) {
  return {
    type: REMINDER_STOP_PAY_CHANGE,
    payload: isStopPayReminder
  }
}

export function changeReminderTime(timeInMin) {
  return {
    type: REMINDER_TIME_CHANGE,
    payload: timeInMin
  }
}

export function setInvalidTime(time) {
  return {
    type: INVALID_TIME_SET,
    payload: time
  }
}

export function setBluetooth(connection) {
  return {
    type: BLUETOOTH_NAME_SET,
    payload: connection
  }
}