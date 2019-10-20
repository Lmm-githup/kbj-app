export const Validator = function () {
  this.cache = [] // 保存校验规则
}

/*
validator.add(registerForm.userName,[
  {strategy: 'isNoEmpty',errorMsg:'用户名不能为空'},
  {strategy: 'minLength:6',errorMsg:'用户名长度不能小于6位'},
  {strategy: 'isEqualTo:password2',errorMsg:'两次密码不一致'}
]);
*/

Validator.prototype.add = function (obj, rules) {
  let _this = this
  // 遍历多个规则
  for (let i = 0, rule; rule = rules[i++];) {
    (function (rule) {
      // 以:分割 前面是要验证的规则 后面的 params minLength:6
      let strategyArr = rule.strategy.split(':')
      // 该条验证的错误信息
      let errorMsg = rule.errorMsg
      // 往 cache 中添加一个函数项
      _this.cache.push(function () {
        // 取出规则名
        let strategy = strategyArr.shift()
        // 待验证 value 放到第一项
        strategyArr.unshift(obj)
        // errorMsg 放到最后
        strategyArr.push(errorMsg)

        return Strategies[strategy].apply(obj, strategyArr)
      })
    })(rule)
  }
}
Validator.prototype.start = function () {
  for (let i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
    let msg = validatorFunc()
    if (msg) return msg
  }
}
// 策略
const Strategies = {
  // 不为空
  isNoEmpty: function (value, errorMsg) {
    if (value === '') {
      return errorMsg
    }
  },
  // 再次输入
  enterAgain: function (value, target, errorMsg) {
    if (target && !value) {
      return errorMsg
    }
  },
  // 限制最小长度
  minLength: function (value, length, errorMsg) {
    if (value.length < length) {
      return errorMsg
    }
  },
  // 限制最大长度
  maxLength: function (value, length, errorMsg) {
    if (value.length > length) {
      return errorMsg
    }
  },
  // 是否相等
  isEqualTo: function (value, target, errorMsg) {
    if (value !== target) {
      return errorMsg
    }
  },
  // 是否为邮箱
  isEmail: function (value, errorMsg) {
    let reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
    if (!reg.test(value)) {
      return errorMsg
    }
  },
  isTrue: function (value, errorMsg) {
    if (!value) return errorMsg
  },
  isDate: function (value, errorMsg) {
    console.log('value', value)
    if (!(isNaN(value) && !isNaN(Date.parse(value)))) {
    // if (!(value instanceof Date)) {
      return errorMsg
    }
  },
  compareByNumer: function (value, target, errorMsg) {
    if (value < target) {
      return errorMsg
    }
  }
}
