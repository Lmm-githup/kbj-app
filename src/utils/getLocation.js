export function getLocation () {
  let options = {
    enableHighAccuracy: true,
    maximumAge: 1000
  }
  if (navigator.geolocation) {
    // 浏览器支持geolocation
    // alert('浏览器支持geolocation');
    navigator.geolocation.getCurrentPosition(onSuccess, onError, options)
  } else {
    // 浏览器不支持geolocation
    alert('浏览器不支持geolocation')
  }
}
function onSuccess (pos) {
  console.log('经度：' + pos.coords.longitude + '纬度：' + pos.coords.latitude)
}
function onError (error) {
  switch (error.code) {
    case 1:
      alert('位置服务被拒绝')
      break
    case 2:
      alert('暂时获取不到位置信息')
      break
    case 3:
      alert('获取信息超时')
      break
    case 4:
      alert('未知错误')
      break
  }
}
