import request from '@/utils/request';


/**
 * 获取筛选列表
 * @param Object [memberName, mobile, sex, birthday, verificationCode]
 */
export const getFilter = () => {
  return request('POST', '/common/filter/member', {});
};

/**
 * 获取会员列表
 * @param Object params
 */
export const getList = (params) => {
  return request('POST', '/member/list', params);
};

/**
 * 获取会员信息
 * @param String custNo
 */
export const getMemberInfo = ({
  custNo
}) => {
  return request('POST', '/member/info', {
    custNo
  });
};

/**
 * 获取会员信息
 * @param String memberNo
 * @param String status N:关注/Y:取消关注
 */
export const editFollow = ({
  memberNo,
  status
}) => {
  return request('POST', '/focus/edit', {
    memberNo,
    status
  });
};

/**
 * 获取会员信息-订单列表
 * @param Object params
 */
export const getMemberOrder = (params) => {
  return request('POST', '/order/list', params);
};

/**
 * 获取会员信息-维系任务列表
 * @param String custNo
 */
export const getMemberTask = ({
  custNo
}) => {
  return request('POST', '/relation/relaList', {
    custNo
  });
};

/**
 * 获取导购自定义维系列表
 * @param number type
 * @param number status
 */
export const getGuideCustomTask = ({
  currentPage,
  pageSize,
  type,
  status
}) => {
  return request('POST', '/relation/list', {
    currentPage,
    pageSize,
    type,
    status
  });
};


/**
 * 添加自定义维系任务
 * @param String  relaName 维系任务名称
 * @param String  startDate
 * @param String  endDate
 * @param String  type 1:自定义
 * @param Array  customerRelaServiceDtoList 
 * [{
 *    memberName string 会员名称 必填
 *    birthday string 生日
 *    custNo string 会员编号 必填
 *    mobile string 手机号
 *    sex string 性别
 *    status string 默认传 未维系
 * }]
 */
export const addTask = ({
  relaName,
  startDate,
  endDate,
  type = 1,
  customerRelaServiceDtoList
}) => {
  return request('POST', '/relation/addCustomByMember', {
    relaName,
    startDate,
    endDate,
    type,
    customerRelaServiceDtoList
  });
};

export const newAdd = (params) => {
  return request('POST', 'relation/add', params);
};

/**
 * 添加会员到已有自定义维系任务
 * @param Object [params]
 */
export const addMemberToTask = (params) => {
  return request('POST', '/relation/addCustomTaskRoste', params);
};

/**
 * 维系会员状态改变
 * @param String [custNo ]
 * @param String [relaId 关系维系ID]
 * @param String [taskStatus 未维系 | 已维系]
 * @param String [callFlag 已接听 | 未接听]
 * @param String [taskResult 流失 | 挽回]
 */
export const editTaskStatus = ({
  custNo,
  relaId,
  taskStatus,
  callFlag,
  taskResult
}) => {
  return request('POST', '/relation/editCustomTaskRoste', {
    custNo,
    relaId,
    taskStatus,
    callFlag,
    taskResult
  });
};

/**
 * 获取会员标签列表
 * @param String custNo
 */
export const getTags = ({
  custNo
}) => {
  return request('POST', '/tag/member/list', {
    custNo
  });
};

/**
 * 修改会员标签
 * @param String custNo
 * @param Array memberTagDtoList
 */
export const editTags = ({
  custNo,
  memberTagDtoList
}) => {
  return request('POST', '/tag/edit', {
    custNo,
    memberTagDtoList
  });
};

/**
 * 添加会员
 * @param Object [memberName, mobile, sex, birthday, verificationCode]
 */
export const addMember = ({
  memberName,
  mobile,
  sex,
  birthday,
  verificationCode
}) => {
  return request('POST', '/member/save', {
    memberName,
    mobile,
    sex,
    birthday,
    verificationCode
  });
};

/**
 * 获取短信验证码
 * @param String mobile
 */
export const getCode = ({
  mobile
}) => {
  return request('POST', '/common/sms/code', {
    mobile
  });
};

/**
 * 判断是否已经开通家庭卡
 * @param String [custNo ]
 */
export const checkFamily = ({
  custNo
}) => {
  return request('POST', '/member/isOpenFamilyCard', {
    custNo
  });
};

/**
 * 开通家庭卡
 * @param String [custNo ]
 */
export const openFamily = ({
  custNo
}) => {
  return request('POST', '/member/familyCardOpen', {
    custNo
  });
};

/**
 * 获取家庭卡成员列表
 * @param String [custNo ]
 */
export const getFamily = ({
  custNo
}) => {
  return request('POST', '/member/familyCardMem', {
    custNo
  });
};

/**
 * 家庭卡添加成员
 * @param Object [cardId, name, ship, phone, pointsPermission, voucherPermission]
 */
export const addFamily = ({
  custNo,
  name,
  ship,
  phone,
  pointsPermission,
  voucherPermission
}) => {
  return request('POST', '/member/familyCardAddMem', {
    custNo,
    name,
    ship,
    phone,
    pointsPermission,
    voucherPermission
  });
};

/**
 * 家庭卡修改成员
 * @param Object [cardNum, familyId, name, phone, pointsPermission, ship]
 */
export const editFamily = ({
  cardNum,
  familyId,
  name,
  phone,
  pointsPermission,
  ship
}) => {
  return request('POST', '/member/familyCardEditMem', {
    cardNum,
    familyId,
    name,
    phone,
    pointsPermission,
    ship
  });
};


/**
 * 获取病症信息
 * @param String [memberId ]
 */
export const getIllnessInfo = ({
  memberId
}) => {
  return request('POST', '/member/disease/info', {
    memberId
  });
};

/**
 * 修改病症信息
 * @param Object [params ]
 */
export const editIllnessInfo = (params) => {
  return request('POST', '/member/disease/save', params);
};

/**
 * 获取健康指标记录保存
 * @param Array [params ]
 */
export const editHealthLog = (params) => {
  return request('POST', '/member/health/add', params);
};

/**
 * 获取健康指标记录
 * @param String [memberNo ]
 */
export const getHealthLog = ({
  memberNo
}) => {
  return request('POST', '/member/health/totalList', {
    memberNo
  });
};

/**
 * 获取健康指标记录详情
 * @param String [memberNo, measTime]
 */
export const getHealthLogDetail = ({
  memberNo,
  mappingId
}) => {
  return request('POST', '/member/health/list', {
    memberNo,
    mappingId
  });
};

/**
 * 获取问卷信息汇总
 * @param String [custNo ]
 */
export const getResearchInfo = ({
  custNo
}) => {
  return request('POST', '/member/survey/total', {
    custNo
  });
};

/**
 * 获取会员问卷列表
 * @param String [custNo ]
 */
export const getResearchLog = ({
  custNo,
  flag
}) => {
  return request('POST', '/member/survey/list', {
    custNo,
    flag
  });
};

/**
 * 获取会员问卷详情
 * @param String [surveyId 问券ID ]
 * @param String [flag  0未答问卷 1已答问卷 ]
 */
export const getResearchDetail = ({
  surveyId,
  flag
}) => {
  return request('POST', '/member/survey/detail', {
    surveyId,
    flag
  });
};

/**
 * 提交会员问卷
 * @param String [custNo 会员ID ]
 * @param Array [answers ]
 */
export const editAnswerCommit = ({
  volumeID,
  custNo,
  answerList
}) => {
  return request('POST', '/member/survey/answerCommit', {
    volumeID,
    custNo,
    answerList
  });
};

/**
 * 获取会员积分列表
 * @param Object params
 * @param String [params.type: （1：增加，2：扣减），全部明细不输入 ]
 */
export const getMemberScore = (params) => {
  return request('POST', '/member/integral/list', params);
};

/**
 * 获取会员优惠券列表
 * @param String [memberId ]
 * @param String [voucherStatus: （状态 未使用、已使用、待生效、已过期、已领取) ]
 */
export const getMemberCoupon = ({
  memberId,
  voucherStatus,
  currentPage,
  pageSize
}) => {
  return request('POST', '/coupon/detailList', {
    memberId,
    voucherStatus,
    currentPage,
    pageSize
  });
};

/**
 * 药学服务 - 用药提醒|用药关怀
 * @param String [custNo ]
 * @param String [remindTypeCode: （6：用药提醒, X：待补充 ]
 */
export const getMemberPharmacy = ({
  custNo,
  remindTypeCode
}) => {
  return request('POST', '/remind/list', {
    custNo,
    remindTypeCode
  });
};


/**
 * 药学服务 - 关联用药 
 * @param String [memberId ]
 */
export const getMemberRelationPharmacy = ({
  memberId
}) => {
  return request('POST', '/product/member/unionDrug', {
    memberId
  });
};

/**
 * 服务信息 - 查询意见反馈列表 
 * @param String [memId ]
 */
export const getFeedbackList = ({
  memId
}) => {
  return request('POST', '/member/feedback/list', {
    memId
  });
};

/**
 * 服务信息 - 查询意见反馈详情
 * @param String [srId ]
 */
export const getFeedbackDetail = ({
  srId
}) => {
  return request('POST', '/member/feedback/info', {
    srId
  });
};

/**
 * 服务信息 - 查询邀约活动列表 
 * @param String [memId ]
 */
export const getInvitationList = ({
  memId
}) => {
  return request('POST', '/activity/invitation/list', {
    memId
  });
};

/**
 * 服务信息 - 查询邀约活动详情
 * @param String [activityId ]
 * @param String [memId ]
 */
export const getInvitationDetail = ({
  activityId,
  memId
}) => {
  return request('POST', '/activity/invitation/info', {
    activityId,
    memId
  });
};

/**
 * 会员管理--会员转交
 * @param String [InUserNo ] 转入导购id
 * @param String [ outUserNo ] 传出导购id
 * @param String [ transferReason ] 传出原因
 * @param String [ inUserName ] 转入用户名
 * @param String [ outUserName ] 转出用户名
 * @param Array [ customerDtoList ]
        {
            "custNo": "会员编号",
            "memberName": "会员名称"
        }
 */
export const postMemberDistribution = ({
  inUserNo,
  outUserNo,
  transferReason,
  inUserName,
  outUserName,
  customerDtoList
}) => {
  return request('POST', '/member/distribution', {
    inUserNo,
    outUserNo,
    transferReason,
    inUserName,
    outUserName,
    customerDtoList
  });
};

/**
 * 提交慢病建档
 * @param Object [params ] 
 */
export const addRecord = (params) => {
  return request('POST', '/member/archives/add', params);
};

/**
 * 获取慢病建档
 * @param String [custNo ] 
 */
export const getRecord = ({
  custNo
}) => {
  return request('POST', '/member/archives/detail', {
    custNo
  });
};

/**
 * 修改会员信息
 * @param String [custNo ] 
 */
export const editMember = (params) => {
  return request('POST', '/member/edit', params);
};
