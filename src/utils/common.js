export const datefmt = (time, format = 'YYYY-MM-DD HH:mm:ss') => {
  // if (!time) return '-'
  if (!time || time == 'null') return ''
  let t = new Date(time)
  let tf = function (i) { return (i < 10 ? '0' : '') + i }
  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, function (a) {
    switch (a) {
      case 'YYYY':
        return tf(t.getFullYear())
      case 'MM':
        return tf(t.getMonth() + 1)
      case 'mm':
        return tf(t.getMinutes())
      case 'DD':
        return tf(t.getDate())
      case 'HH':
        return tf(t.getHours())
      case 'ss':
        return tf(t.getSeconds())
    }
  })
}