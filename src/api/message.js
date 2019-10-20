import request from '@/utils/request';

/**
 * 提醒综合信息列表
 * @param {string} [guideId] 导购id
 * @returns
 */
export const totalList = (flags) => {
  return request('POST', 'remind/totalList', {flags})
}

/**
 * 提醒信息列表
 * @param {string} [remindTypeCode] 列表类型
 * @returns
 */
export const getRemindList = (params) => {
  return request('POST', 'remind/list', params)
}

/**
 * 消息提醒同步接口
 * @returns
 */
export const confirmRemind = (params) => {
  return request('POST', 'remind/confirmRemind', params)
}

/**
 * 查询提醒设置
 * @returns
 */
export const getMessageSet = () => {
  return request('POST', 'user/emp/getRemindSetup', {})
}

/**
 * 保存提醒设置
 * @returns
 */
export const saveMessageSet = (params) => {
  return request('POST', 'user/emp/updateRemindSetup', params)
}
/**
 * 聊天记录
 * @returns
 */
export const chatHistory = (params) => {
  return request('POST', 'user/getUnlimited', params)
}