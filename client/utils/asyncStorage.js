import AsyncStorage from '@react-native-community/async-storage';

export const setStringValue = async value => {
  try {
    await AsyncStorage.setItem('key', value);
  } catch (e) {
    // save error
  }

  console.log('Done.');
};
export const setObjectValue = async value => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('key', jsonValue);
  } catch (e) {
    // save error
  }

  console.log('Done.');
};
export const getMyStringValue = async () => {
  try {
    return await AsyncStorage.getItem('@key');
  } catch (e) {
    // read error
  }

  console.log('Done.');
};
export const getMyObject = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@key');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // read error
  }

  console.log('Done.');
};
