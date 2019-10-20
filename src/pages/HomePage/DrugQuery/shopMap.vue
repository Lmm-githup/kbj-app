<template>
  <div class="map-container" id="map-container">
    <x-header :left-options="{showBack: true,backText: ''}" style="height: 7%;" >门店地图</x-header>
    <div class="info">
      <div>
        <div class="name">{{shopInfo.orgName | nullset}}</div>
        <div class="tel">{{shopInfo.phone | nullset}}</div>
      </div>
      <div>
        <a class="handle-btn" :href="'tel:' + shopInfo.mobile">
          <i class="van-icon van-icon-phone-o"></i>
        </a>
      </div>
    </div>
    <div class="address">
      <span class="left">{{shopInfo.address | nullset}}</span> 
      <a class="right" @click="drawLine">路线</a>
    </div>
    <div id="container" class="map"></div>
    <div id="panel"></div>
  </div>
</template>

<script>
import Vue from "vue";
import { XHeader } from "vux";

export default {
  components: {
    XHeader
  },
  data() {
    return {
      center: [],
      otherPoint: [],
      map: ''
    };
  },
  computed: {
    shopInfo(){
      return this.$store.state.drug.currentShopInfo
    }
  },
  methods: {
    drawLine(){
      console.log(AMap)
      let _this = this
      AMap.plugin(["AMap.Walking"], function() {
        let drivingOption = {
          map: _this.map,
          panel: "panel"
        };
        
        let walking = new AMap.Walking(drivingOption); 
        walking.search(_this.center, _this.otherPoint, function(status, result){
        // walking.search([113.914695,22.513413],[113.920886,22.511306], function(status, result){
          if(status === 'complete') {
            console.log('绘制步行路线完成')
          } else {
            console.log('步行路线数据查询失败' + result)
            if (result == 'OVER_DIRECTION_RANGE') {
              _this.$vux.toast.show({
                text: '起点终点距离过长。',
                time: 2000,
                type: "text"
              });
            } 
          }
        });
        
    });
    }
  },
  created() {
    // console.log(JSON.parse(this.$route.query.ip));
    console.log(this.drupShopInfo)
    let ip = JSON.parse(this.$route.query.ip);

    this.center = [ip.userIp.longitude, ip.userIp.latitude];
    this.otherPoint = [ip.shopIp.longitude, ip.shopIp.latitude];

    let _this = this

    const dom = document.createElement('script');
    dom.type = 'text/javascript';
    dom.src = 'https://webapi.amap.com/maps?v=1.4.14&key=9d2ed9beb0815bfd1925418979c58e68&plugin=AMap.ToolBar';
    document.body.appendChild(dom)

    dom.onload = () => {
      let map = new AMap.Map("container", {
        zoom: 13,
        // center: [116.43, 39.92],
        resizeEnable: true
      });
      _this.map = map
      let options = {
        'showButton': true,//是否显示定位按钮
        'buttonPosition': 'LB',//定位按钮的位置
        /* LT LB RT RB */
        'buttonOffset': new AMap.Pixel(10, 20),//定位按钮距离对应角落的距离
        'showMarker': true,//是否显示定位点
        'markerOptions':{//自定义定位点样式，同Marker的Options
          'offset': new AMap.Pixel(-18, -36),
          'content':'<img src="https://a.amap.com/jsapi_demos/static/resource/img/user.png" style="width:36px;height:36px"/>'
        },
        'showCircle': true,//是否显示定位精度圈
        'circleOptions': {//定位精度圈的样式
          'strokeColor': '#0093FF',
          'noSelect': true,
          'strokeOpacity': 0.5,
          'strokeWeight': 1,
          'fillColor': '#02B0FF',
          'fillOpacity': 0.25
        }
      }
      // 定位
      AMap.plugin(["AMap.Geolocation"], function() {
        var geolocation = new AMap.Geolocation(options);
        map.addControl(geolocation);
        geolocation.getCurrentPosition()
      });
      AMap.plugin([
        'AMap.ToolBar',
      ], function(){
          // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
          map.addControl(new AMap.ToolBar({
              // 简易缩放模式，默认为 false
              liteStyle: true
          }));
      });

      // AMap.plugin(["AMap.Walking"], function() {
      //     let drivingOption = {
      //       map: map,
      //       // panel: "panel"
      //     };
          
      //     let walking = new AMap.Walking(drivingOption); 
      //     walking.search(_this.center, _this.otherPoint, function(status, result){
      //     // walking.search([113.914695,22.513413],[113.920886,22.511306], function(status, result){
      //       if(status === 'complete') {
			// 				console.log('绘制步行路线完成')
			// 			} else {
      //         console.log('步行路线数据查询失败' + result)
      //         if (result == 'OVER_DIRECTION_RANGE') {
      //           _this.$vux.toast.show({
      //             text: '起点终点距离过长。',
      //             time: 2000,
      //             type: "text"
      //           });
      //         } 
			// 			}
      //     });
          
      // });
    }
    
  }
};
</script>

<style lang="less" scoped>
.map-container {
  position: absolute;
  width: 100%;
  // height: 75%;
  height: 100%;
  .map {
    width: 100%;
    height: 66%;
  }
}
.info {
  background-color: #fff;
  padding: 10px 15px;
  border-top: 1px solid #dfdfdf;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .name {
    font-size: 16px;
    font-weight: 700;
    color: #333;
  }
  .tel {
    margin-top: 10px;
  }
}
.address {
  margin-top: 10px;
  background-color: #fff;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  .right {
    background-color: rgba(0,202,172,1);
    color: #fff;
    padding: 2px 10px;
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
  }
}
.handle-btn {
  width: 35px;
  height: 35px;
  border: 1px solid rgba(0,202,172,1);
  color: rgba(0,202,172,1);
  display: block;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}
</style>
