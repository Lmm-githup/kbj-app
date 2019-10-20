import Vue from 'vue';
import Router from 'vue-router';

import Layout from '@/pages/Mymember/Layout'

Vue.use(Router);

export default new Router({
  routes: [{
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index', 
      name: 'Index',
      redirect: '/HomePage',
      meta: {
        'keepAlive': true
      },
      component: () => import('@/pages/index'),
      children: [{
          path: '/HomePage',
          name: 'HomePage',
          meta: {
            'keepAlive': true
          },
          component: () => import('@/pages/HomePage/index')
        },
        {
          path: '/Message',
          name: 'Message',
          meta: {
            'keepAlive': true
          },
          component: () => import('@/pages/Message/index')
        },
        {
          path: '/Mymember',
          name: 'Mymember',
          meta: {
            'keepAlive': true
          },
          component: () => import('@/pages/Mymember/index')
        },
        {
          path: '/Statistics',
          name: 'Statistics',
          meta: {
            'keepAlive': true
          },
          component: () => import('@/pages/Statistics/index')
        },
        {
          path: '/User',
          name: 'User',
          meta: {
            'keepAlive': true
          },
          component: () => import('@/pages/User/index')
        }
      ]
    },
    {
      path: '',
      component: Layout,
      children: [{
          path: '/inquireMember',
          name: 'inquireMember',
          add: "xyq",
          meta: {
            title: '查询客户',
            pdt: true,
            showRight: "",
            showCard: false
          },
          component: () => import('@/pages/Mymember/inquireMember')
        },
        {
          path: '/searchMember',
          name: 'searchMember',
          add: "xyq",
          meta: {
            title: '搜索客户',
            pdt: true,
            showRight: "",
            showCard: false
          },
          component: () => import('@/pages/Mymember/searchMember')
        },
        {
          path: '/addMember',
          name: 'addMember',
          add: "xyq",
          meta: {
            title: '注册会员',
            pdt: true,
            showRight: "",
            showCard: false
          },
          component: () => import('@/pages/Mymember/addMember')
        },
        {
          path: '/addTags/:custNo',
          name: 'addTags',
          add: "xyq",
          meta: {
            title: '添加标签',
            pdt: true,
            showRight: "",
            showCard: false
          },
          component: () => import('@/pages/Mymember/addTags'),
          props: true
        },
        {
          path: '/buyList/:custNo',
          name: 'buyList',
          add: "xyq",
          meta: {
            title: '购买记录',
            pdt: true,
            showRight: "",
            showCard: false
          },
          component: () => import('@/pages/Mymember/buyList'),
          props: true
        },
        {
          path: '/healthLog/:custNo',
          name: 'healthLog',
          add: "xyq",
          meta: {
            title: '健康指标记录',
            pdt: true,
            showRight: "",
            showCard: false
          },
          component: () => import('@/pages/Mymember/healthLog'),
          props: true
        },
        {
          path: '/healthLogDetail/:memberNo/:measTime',
          name: 'healthLogDetail',
          add: "xyq",
          meta: {
            title: '记录详情',
            pdt: true,
            showRight: "",
            showCard: false
          },
          component: () => import('@/pages/Mymember/healthLogDetail'),
          props: true
        },
        {
          path: '/Article/:id/:type/:custNo',
          name: 'Article',
          add: "xyq",
          meta: {
            title: '服务详情',
            pdt: true,
            showRight: "",
            showCard: false
          },
          component: () => import('@/pages/Mymember/Article'),
          props: true
        },
        {
          path: '/researchLog/:custNo/:flag',
          name: 'researchLog',
          add: "xyq",
          meta: {
            title: '历史记录',
            pdt: true,
            showRight: "",
            showCard: false
          },
          component: () => import('@/pages/Mymember/researchLog'),
          props: true
        },
        {
          path: '/researchDetail/:id/:flag/:title',
          name: 'researchDetail',
          add: "xyq",
          meta: {
            title: '记录详情',
            pdt: true,
            showRight: "",
            showCard: false
          },
          component: () => import('@/pages/Mymember/researchDetail'),
          props: true
        },
        {
          path: '/memberScores/:custNo/:numerator',
          name: 'memberScores',
          add: "xyq",
          meta: {
            title: '我的积分',
            pdt: true,
            showRight: "",
            showCard: false
          },
          component: () => import('@/pages/Mymember/memberScores'),
          props: true
        },
        {
          path: '/memberCoupon/:custNo',
          name: 'memberCoupon',
          add: "xyq",
          meta: {
            title: '优惠券',
            pdt: false,
            showRight: "",
            showCard: false
          },
          component: () => import('@/pages/Mymember/memberCoupon'),
          props: true
        },
        {
          path: '/memberDetail/:custNo',
          name: 'memberDetail',
          add: "xyq",
          meta: {
            title: '会员详情',
            pdt: false,
            showRight: "",
            showCard: true
          },
          component: () => import('@/pages/Mymember/memberDetail'),
          props: true
        },
        {
          path: '/MemberKeepTask/:custNo',
          name: 'MemberKeepTask',
          add: "xyq",
          meta: {
            title: '维系记录',
            pdt: false,
            showRight: "",
            showCard: false
          },
          component: () => import('@/pages/Mymember/keepTask'),
          props: true
        },
        {
          path: '/pharmacyService/:custNo',
          name: 'pharmacyService',
          add: "xyq",
          meta: {
            title: '药学服务',
            pdt: false,
            showRight: "",
            showCard: false
          },
          component: () => import('@/pages/Mymember/pharmacyService'),
          props: true
        },
        {
          path: '/memberCenter/:custNo',
          name: 'memberCenter',
          add: "xyq",
          meta: {
            title: '会员相关信息',
            pdt: false,
            showRight: "goChat",
            showCard: false
          },
          component: () => import('@/pages/Mymember/memberCenter'),
          props: true
        },
        {
          path: '/memberBasic/:custNo',
          name: 'memberBasic',
          add: "xyq",
          meta: {
            title: '会员基本信息',
            pdt: false,
            showRight: "",
            showCard: false
          },
          component: () => import('@/pages/Mymember/memberBasic'),
          props: true
        },
        {
          path: '/illnessInfo/:custNo',
          name: 'illnessInfo',
          add: "xyq",
          meta: {
            title: '病症信息',
            pdt: false,
            showRight: "",
            showCard: false
          },
          component: () => import('@/pages/Mymember/illnessInfo'),
          props: true
        },
        {
          path: '/healthInfo/:custNo',
          name: 'healthInfo',
          add: "xyq",
          meta: {
            title: '健康信息',
            pdt: false,
            showRight: "",
            showCard: false
          },
          component: () => import('@/pages/Mymember/healthInfo'),
          props: true
        },
        {
          path: '/serviceInfo/:custNo',
          name: 'serviceInfo',
          add: "xyq",
          meta: {
            title: '服务信息',
            pdt: false,
            showRight: "",
            showCard: false
          },
          component: () => import('@/pages/Mymember/serviceInfo'),
          props: true
        },
        {
          path: '/researchInfo/:custNo',
          name: 'researchInfo',
          add: "xyq",
          meta: {
            title: '问卷信息',
            pdt: false,
            showRight: "",
            showCard: false
          },
          component: () => import('@/pages/Mymember/researchInfo'),
          props: true
        },
        {
          path: '/familyMember/:custNo',
          name: 'familyMember',
          add: "xyq",
          meta: {
            title: '家庭成员',
            pdt: true,
            showRight: "addFamilyCard",
            showCard: false
          },
          component: () => import('@/pages/Mymember/familyMember'),
          props: true
        },
        {
          path: '/addFamilyCard/:custNo/:item?',
          name: 'addFamilyCard',
          add: "xyq",
          meta: {
            title: '家庭卡',
            pdt: true,
            showRight: "",
            showCard: false
          },
          component: () => import('@/pages/Mymember/addFamilyCard'),
          props: true
        },
        {
          path: '/recordInfo/:custNo',
          name: 'recordInfo',
          add: "xyq",
          meta: {
            title: '慢病建档',
            pdt: true,
            showRight: "",
            showCard: false
          },
          component: () => import('@/pages/Mymember/recordInfo'),
          props: true
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login')
    },
    {
      path: '/editUserInfo',
      name: 'editUserInfo',
      component: () => import('@/pages/User/editUserInfo')
    },
    {
      path: '/editPassword',
      name: 'editPassword',
      component: () => import('@/pages/User/editPassword')
    },
    {
      path: '/setUser',
      name: 'setUser',
      component: () => import('@/pages/User/set/setUser')
    },
    {
      path: '/setUserBaseInfo',
      name: 'setUserBaseInfo',
      component: () => import('@/pages/User/set/setUserBaseInfo')
    },
    {
      path: '/userDetail',
      name: 'userDetail',
      component: () => import('@/pages/User/set/userDetail')
    },
    {
      path: '/addStaff',
      name: 'addStaff',
      component: () => import('@/pages/User/set/addStaff')
    },
    {
      path: '/editStaff',
      name: 'editStaff',
      component: () => import('@/pages/User/set/editStaff')
    },
    {
      path: '/addOrg',
      name: 'addOrg',
      component: () => import('@/pages/User/set/addOrg')
    },
    {
      path: '/orgList',
      name: 'orgList',
      component: () => import('@/pages/User/set/orgList')
    },
    {
      path: '/editOrgList',
      name: 'editOrgList',
      component: () => import('@/pages/User/set/editOrgList')
    },
    {
      path: '/addPosition',
      name: 'addPosition',
      component: () => import('@/pages/User/set/addPosition')
    },
    {
      path: '/positionList',
      name: 'positionList',
      component: () => import('@/pages/User/set/positionList')
    },
    {
      path: '/permissionSet',
      name: 'permissionSet',
      component: () => import('@/pages/User/set/permissionSet')
    },
    {
      path: '/jurisdiction',
      name: 'jurisdiction',
      component: () => import('@/pages/User/set/jurisdiction')
    },
    // 邀请入会
    {
      path: '/inviteQRcode',
      name: 'inviteQRcode',
      component: () => import('@/pages/HomePage/inviteQRcode')
    },
    // 我的名片
    {
      path: '/myCard',
      name: 'myCard',
      component: () => import('@/pages/HomePage/myCard')
    },
    // 券 管理
    {
      path: '/ticket',
      name: 'ticket',
      component: () => import('@/pages/HomePage/Ticket/index')
    },
    // 优惠券明细
    {
      path: '/ticketDetail',
      name: 'ticketDetail',
      component: () => import('@/pages/HomePage/Ticket/detail')
    },
    // 优惠券发放
    {
      path: '/ticketGiveOut',
      name: 'ticketGiveOut',
      component: () => import('@/pages/HomePage/Ticket/giveOut')
    },
    // 优惠券领取
    {
      path: '/ticketGet',
      name: 'ticketGet',
      component: () => import('@/pages/HomePage/Ticket/get')
    },
    // 优惠券领取成功
    {
      path: '/ticketGetSuccess',
      name: 'ticketGetSuccess',
      component: () => import('@/pages/HomePage/Ticket/success')
    },
    // 优惠券领取失败
    {
      path: '/ticketGetError',
      name: 'ticketGetError',
      component: () => import('@/pages/HomePage/Ticket/error')
    },
    // 优惠券兑换
    {
      path: '/ticketExchange',
      name: 'ticketExchange',
      component: () => import('@/pages/HomePage/Ticket/exchange')
    },
    // 关系维系
    {
      path: '/relationship',
      name: 'relationship',
      component: () => import('@/pages/HomePage/Relationship/index')
    },
    // 维系任务
    {
      path: '/keepTask',
      name: 'keepTask',
      component: () => import('@/pages/HomePage/Relationship/keepTask')
    },
    // 邀约任务
    {
      path: '/inviteTask',
      name: 'inviteTask',
      component: () => import('@/pages/HomePage/Relationship/inviteTask')
    },
    // 维系列表
    {
      path: '/keeplist',
      name: 'keeplist',
      component: () => import('@/pages/HomePage/Relationship/keepList')
    },
    // 维系列表
    {
      path: '/invitelist',
      name: 'invitelist',
      component: () => import('@/pages/HomePage/Relationship/inviteList')
    },
    // 自定义维系
    {
      path: '/customTask',
      name: 'customTask',
      component: () => import('@/pages/HomePage/Relationship/customTask')
    },
    // 自定义维系
    {
      path: '/addCustomTask',
      name: 'addCustomTask',
      component: () => import('@/pages/HomePage/Relationship/addCustomTask')
    },
    // 药品查询
    {
      path: '/drugQuery',
      name: 'drugQuery',
      component: () => import('@/pages/HomePage/DrugQuery/index')
    },
    // 药品详情
    {
      path: '/drugDetail',
      name: 'drugDetail',
      component: () => import('@/pages/HomePage/DrugQuery/drugDetail')
    },
    // 药品附近门店
    {
      path: '/drugShop',
      name: 'drugShop',
      component: () => import('@/pages/HomePage/DrugQuery/drugShop')
    },
    // 门店地图
    {
      path: '/shopMap',
      name: 'shopMap',
      component: () => import('@/pages/HomePage/DrugQuery/shopMap')
    },
    // 找药申请
    {
      path: '/findDrug',
      name: 'findDrug',
      component: () => import('@/pages/HomePage/DrugQuery/findDrug')
    },
    // 找药申请记录
    {
      path: '/findDrugDetail',
      name: 'findDrugDetail',
      component: () => import('@/pages/HomePage/DrugQuery/findDrugDetail')
    },
    // 导购意见箱
    {
      path: '/shoppersOpinion',
      name: 'shoppersOpinion',
      component: () => import('@/pages/HomePage/Shopper/index')
    },
    // 写意见
    {
      path: '/writeOpinion',
      name: 'writeOpinion',
      component: () => import('@/pages/HomePage/Shopper/write')
    },
    // 意见详情
    {
      path: '/contentOpinion',
      name: 'contentOpinion',
      component: () => import('@/pages/HomePage/Shopper/content')
    },
    // 通告管理
    {
      path: '/callboard',
      name: 'callboard',
      component: () => import('@/pages/HomePage/Callboard/index')
    },
    // 通告详情
    {
      path: '/callboardDetail',
      name: 'callboardDetail',
      component: () => import('@/pages/HomePage/Callboard/detail')
    },
    // O2O
    {
      path: '/o2o',
      name: 'o2o',
      component: () => import('@/pages/HomePage/O2O/index')
    },
    // O2O
    {
      path: '/o2oDetail',
      name: 'o2oDetail',
      component: () => import('@/pages/HomePage/O2O/detail')
    },
    // 活动管理
    {
      path: '/activity',
      name: 'activity',
      component: () => import('@/pages/HomePage/Activity/index')
    },
    // 活动详情
    {
      path: '/activityDetail',
      name: 'activityDetail',
      component: () => import('@/pages/HomePage/Activity/detail')
    },
    // 培训中心
    {
      path: '/trainCenter',
      name: 'trainCenter',
      component: () => import('@/pages/HomePage/Train/index')
    },
    // 培训ne
    {
      path: '/trainContent',
      name: 'trainContent',
      component: () => import('@/pages/HomePage/Train/content')
    },
    // 会员管理
    {
      path: '/memberManage',
      name: 'memberManage',
      component: () => import('@/pages/HomePage/memberManage/index')
    },
    // 我的关注 myAttention
    {
      path: '/myAttention',
      name: 'myAttention',
      component: () => import('@/pages/HomePage/myAttention/index')
    },
    // 自定义提醒
    {
      path: '/custom',
      name: 'custom',
      component: () => import('@/pages/Message/custom')
    },
    // 提醒详情
    {
      path: '/remindDetails',
      name: 'remindDetails',
      component: () => import('@/pages/Message/details')
    },
    // 排名
    {
      path: '/ranking',
      name: 'ranking',
      component: () => import('@/pages/Statistics/ranking')
    },
    // 明星产品
    {
      path: '/startProduct',
      name: 'startProduct',
      component: () => import('@/pages/Statistics/startProduct')
    },
    // 挂金商品
    {
      path: '/goldProduct',
      name: 'goldProduct',
      component: () => import('@/pages/Statistics/goldProduct')
    },
    // 会员权益
    {
      path: '/memberEquity',
      name: 'memberEquity',
      component: () => import('@/pages/User/member')
    },
    // 慢病会员
    {
      path: '/lentivirusMember',
      name: 'lentivirusMember',
      component: () => import('@/pages/HomePage/lentivirusMember')
    },
    // 聊天记录
    {
      path: '/chatHistory',
      name: 'chatHistory',
      component: () => import('@/pages/Message/chatHistory')
    },
    // 会员排名
    {
      path: '/memberRanking',
      name: 'memberRanking',
      component: () => import('@/pages/Statistics/memberRanking')
    },
    // 会员排名
    {
      path: '/memberAreaDetail',
      name: 'memberAreaDetail',
      component: () => import('@/pages/Statistics/memberAreaDetail')
    },
    // 会员排名
    {
      path: '/memberDistrictDetail',
      name: 'memberDistrictDetail',
      component: () => import('@/pages/Statistics/memberDistrictDetail')
    },
  ]
})
