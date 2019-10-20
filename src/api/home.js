import request from '@/utils/request';


/**
 * 首页维系任务消息通知
 */
export const homeRelation = ({
  userCrmId
}) => {
  return request('POST', '/relation/memNumber', {
    userCrmId
  });
};

/**
 * 首页消息提醒统计
 */
export const messageTotal = (flags) => {
  return request('POST', '/home/unread/message/remind', flags);
};

/**
 * 首页行为统计
 * @param {string} userNo  
 * @param {string} dateType  // 查询时间类型 D/W/M（日、周、月）
 */
export const actionStatistics = ({
  queryType
}) => {
  return request('POST', '/analysis/total', {
    queryType
  })
}

/**
 * 通告列表
 */
export const callboardList = (params) => {
  return request('POST', '/content/announceList', params);
};

/**
 * 通告详情
 */
export const callboardDetail = ({
  rowNo
}) => {
  return request('POST', '/content/info', {
    rowNo
  });
};

/**
 * 通告列表
 */
export const trainList = (params) => {
  return request('POST', '/content/trainList', params);
};

/**
 * 活动汇总
 */
export const activityTotal = () => {
  return request('POST', '/activity/total', {});
};

/**
 * 活动列表
 */
export const activityList = ({activityType,activityStatus}) => {
  return request('POST', '/activity/list', {activityType,activityStatus});
};

export const staffTotal = ({
  queryType
}) => {
  return request('POST', '/analysis/total', {
    queryType
  });
};

/**
 * 邀请入会
 */
export const invitation = () => {
  return request('POST', 'user/invitation', {});
};


/**
 * 获取用户功能模块权限
 */
export const getUserAuth = () => {
  return request('POST', '/user/auth', {});
};

export const detailByMobile = ({mobile}) => {
  return request('POST', 'member/query/detailByMobile', {mobile});
};

export const getConponList = () => {
  return request('POST', 'coupon/available/points', {});
};

export const exchangeCoupon = (params) => {
  return request('POST', '/coupon/exchange', params);
};
