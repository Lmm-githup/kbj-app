import request from '@/utils/request';

/**
 * 药品查询
 * @param {string} [productName] 产品名称
 * @param {string} [sourceMarking] 原印条码
 * @param {string} [orgCrmId] 组织id
 * @param {string} [stockStatus] 库存状态 1 有货；2 无货
 * @returns
 */
export const postDrug = (params) => {
  return request('POST', '/product/list', params)
}

/**
 * 药品详情
 * @param {string} [productCode] 产品编码
 * @returns
 */
export const postDrugDetail = ({ productCode }) => {
  return request('POST', '/product/info', { productCode })
}

/**
 * 关联用药
 * @param {string} [productId] 产品编码
 * @returns
 */
export const postDrugRelation = (params) => {
  return request('POST', '/product/unionDrug', params)
}

/**
 * 药品补货
 * @param {string} [productCode] 产品编码
 * @param {number} [stock] 数量
 * @returns
 */
export const postDrugReplenishment = ({ productCode, stock }) => {
  return request('POST', '/product/replenishment', { productCode, stock })
}

/**
 * 附近门店查询
 * @param {string} [longitude] 经度
 * @param {number} [lat] 纬度
 * @param {number} [orgName] 门店名称

 * @returns
 */
export const postDrugNearbyList = (params) => {
  return request('POST', '/org/nearby/list', params)
}

/**
 * 找药申请
 */
export const postFindDrugData = (params) => {
  return request('POST', '/product/apply', params)
}

/**
 * 找药申请
 */
export const postFindDrugHistory = (params) => {
  return request('POST', '/product/apply/list', params)
}