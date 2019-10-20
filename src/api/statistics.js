import request from '@/utils/request';

/**
 * 排名
 * @param {string} [queryType] store : 门店，area : 区域，company：公司，agent：最佳纳新
 * @returns
 */
export const getRanking = ({ queryType }) => {
  return request('POST', 'analysis/rank', { queryType })
}

/**
 * 明星产品or挂金商品
 * @param {string} [dataType] star : 明星产品， gold : 挂金商品
 * @returns
 */
export const getProList = ({ dataType, productName }) => {
  return request('POST', '/web/analysis/data/list', { dataType,productName, pageSize: 1000})
}

/**
 * 会员排名
 * @returns
 */
export const getMemberRank = () => {
  return request('POST', 'analysis/custTopDefaultList', {})
}

/**
 * 会员排名
 * @returns
 */
export const getMemberRankDetail = (params) => {
  return request('POST', 'analysis/custTopList', params)
}

/**
 * 报表
 * @returns
 */
export const reportViewList = (params) => {
  return request('POST', 'analysis/reportViewList', params)
}

/**
 * 报表筛选
 * @returns
 */
export const roleOrgList = (params) => {
  return request('POST', 'org/roleOrgList', params)
}