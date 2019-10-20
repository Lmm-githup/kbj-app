import Cookies from 'js-cookie'

const keyName = 'UserToken'

export function getToken() {
  return Cookies.get(keyName)
}

export function setToken(token) {
	// console.log(token)
  return Cookies.set(keyName, token)
}

export function removeToken() {
  return Cookies.remove(keyName)
}
