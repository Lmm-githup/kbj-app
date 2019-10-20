import request from '@/utils/request';

/**
 * 优惠券规则列表
 * @param {string} [status] 优惠券状态
 * @returns
 */
export const getTicketList = (params) => {
  return request('POST', '/coupon/list', params)
}

/**
 * 优惠券使用统计信息
 * @param {string} [ruleId] 规则ID 此值为空时，查询所有规则的统计信息
 * @param {string} [beginTime] 优惠券使用日期开始时间，可为空值
 * @param {string} [endTime] 优惠券使用日期结束时间，可为空值
 * @returns
 */
export const getTicketTotal = ({ ruleId, beginTime, endTime }) => {
  return request('POST', '/coupon/detailTotal', { ruleId, beginTime, endTime })
}

/**
 * 查询单个优惠券的使用明细
 * @param {string} [ruleId] 规则ID
 * @param {string} [voucherStatus] 状态 未使用、已使用、待生效、已过期
 * @returns
 */
export const getTicketOneDetail = ({ ruleId, voucherStatus }) => {
  return request('POST', '/coupon/detailTotal', { ruleId, voucherStatus })
}

/**
 * 查询某个优惠券的使用明细
 * @param {string} [ruleId] 规则ID
 * @param {string} [voucherStatus] 状态 未使用、已使用、待生效、已过期
 * @returns
 */
export const getTicketMemberList = (params) => {
  return request('POST', '/coupon/detailList', params)
}

/**
 * 优惠券发放接口
 * @param {string} [ruleNo] 规则编号
 * @param {string} [num] 发放数量限制
 */
export const postSendCoupon = (params) => {
  return request('POST', '/coupon/sendCoupon', params)
}