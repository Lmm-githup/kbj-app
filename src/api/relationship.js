import request from '@/utils/request';

/**
 * 关系维系统计
 */
export const postRelationshipStatistic = () => {
  return request('POST', '/relation/total', {
    
  });
};

/**
 * 关系维系列表
 * @param {number} [type] 类型
 * @param {number} [status] 状态
 */
export const postRelationshipList = (params) => {
  return request('POST', '/relation/list', params);
};

/**
 * 维系会员列表
 */
export const relationMemberList = (params) => {
  return request('POST', '/relation/memList', params);
};

/**
 * 编辑维系客户信息
 */
export const editRelationStatus = (params) => {
  return request('POST', '/relation/editCustomTaskRoste', params);
};

/**
 * 关系维系 - 分派
 * @param {string} [custNo] 会员编码
 * @param {string} [relaId] 维系关系ID
 * @param {string} [userID] 下派员工ID
 * @returns
 */
export const postDispatch = (params) => {
  return request('POST', '/relation/issuedTask', params);
};

/**
 * 活动邀约
 * @returns
 */
export const customTaskInvitation = (params) => {
  return request('POST', '/relation/customTaskInvitation', params);
};
