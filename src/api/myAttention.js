import request from '@/utils/request';

/**
 * 我的关注
 * @param {object} [params] 
 * @returns
 */
export const attentionList = (params) => {
  return request('POST', '/focus/memberDynamicList', params)
}