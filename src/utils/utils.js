/*
 * Utility
 */

import {
	isArray,
	isObject,
	isBoolean
} from 'lodash'//判断value的类型

let instance = null

class Utils {
	constructor() {
		if (!instance) {
			instance = this
		} else {
			return instance
		}
	}


	deviceType () {
    let type

    let UA = navigator.userAgent

    if (UA.indexOf('Android') > -1 || UA.indexOf('Linux') > -1) {
      // 安卓手机
      type = 'android'
    } else if (UA.indexOf('iPhone') > -1) {
      // 苹果手机
      type = 'ios'
    } else if (UA.indexOf('Windows Phone') > -1) {
      // winphone手机
      type = ''
    } else {
      type = ''
    }
    return type
  }
	/**
	 * 设置localStorage
	 * @param {stirng} key
	 * @param {object} data
	 */
	setLocalData(key, data) {
		localStorage.setItem(key, isObject(data) ? JSON.stringify(data) : data)
	}

	/**
	 * 设置sessionStorage
	 * @param {stirng} key
	 * @param {object} data
	 */
	setSessionData(key, data) {
		sessionStorage.setItem(key, isObject(data) ? JSON.stringify(data) : data)
	}

	/**
	 * 获取localStorage
	 * @param {stirng} key
	 * @param {boolean} isParse 是否解析数据
	 */
	getLocalData(key, isParse) {
		return isBoolean(isParse) && isParse ? JSON.parse(localStorage.getItem(key || {})) : localStorage.getItem(key)
	}

	/**
	 * 获取sessionStorage
	 * @param {stirng} key
	 * @param {boolean} isParse 是否解析数据
	 */
	getSessionData(key, isParse) {
		return isBoolean(isParse) && isParse ? JSON.parse(sessionStorage.getItem(key)) : sessionStorage.getItem(key)
	}

	/**
	 * 移除localStorage
	 * @param {[]|stirng} keys 为空则清空localStorage
	 */
	removeLocalData(...keys) {
		const keysArray = Object.keys(keys)

		if (keysArray.length) {
			keysArray.forEach((index) => {
				localStorage.removeItem(keys[index])
			})
		} else {
			localStorage.clear()
		}
	}

	/**
	 * 移除sessionStorage
	 * @param {[]|stirng} keys 为空则清空移除sessionStorage
	 */
	removeSessionData(...keys) {
		const keysArray = Object.keys(keys)

		if (keysArray.length) {
			keysArray.forEach((index) => {
				sessionStorage.removeItem(keys[index])
			})
		} else {
			sessionStorage.clear()
		}
	}

	/**
	 * 获取当前时间戳
	 */
	getTimestamp() {
		return Math.floor(Date.now() / 1000)
	}

	/**
	 * 获取指定的url查询参数值
	 * @param {string} pname 参数名称
	 * @param {string} purl url地址，默认为当前url地址
	 */
	getParameterByName(pname, purl) {
		let name = pname
		let url = purl

		if (!url) url = window.location.href

		name = name.replace(/[[\]]/g, '\\$&')

		const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`)
		const results = regex.exec(url)

		if (!results) return null
		if (!results[2]) return ''

		return decodeURIComponent(results[2].replace(/\+/g, ' '))
	}

	/**
	 * 数组去重
	 * @param {array} arr
	 */
	unique(arr) {
		return Array.from(new Set(arr))
	}

	/**
	 * 深度冻结对象
	 * @param {object} o
	 */
	deepFreeze(o) {
		Object.freeze(o)

		Object.keys(o).forEach((item) => {
			if (typeof item === 'object' && !Object.isFrozen(item)) {
				this.deepFreeze(item)
			}
		})
	}

	removeItemArray(array, index) {
		if (!isArray(array)) {
			debug.throw('Param is not array.')
		}

		return [
			...array.slice(0, index),
			...array.slice(index + 1)
		]
	}

	insertItemArray(array, item, index) {
		if (!isArray(array)) {
			debug.throw('Param is not array.')
		}

		return [
			...array.slice(0, index),
			item,
			...array.slice(index)
		]
	}

	_moveItemArray(array, from, to) {
		const _array = [...array]

		_array.splice(to, 0, _array.splice(from, 1)[0])

		return _array
	}

	upMoveItemArray(array, index) {
		const that = this

		if (!isArray(array)) {
			debug.throw('Param is not array.')
		}

		const from = index
		const to = index - 1

		return that._moveItemArray(array, from, to)
	}

	downMoveItemArray(array, index) {
		const that = this

		if (!isArray(array)) {
			debug.throw('Param is not array.')
		}

		const from = index
		const to = index + 1

		return that._moveItemArray(array, from, to)
	}

	removeItemObject(obj, id) {
		if (!isObject(obj)) {
			debug.throw('Param is not object.')
		}

		const _obj = { ...obj }
		delete _obj[id]

		return _obj
	}
}

export default Utils
