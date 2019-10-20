import request from '@/utils/request';

/**
 * 获取o2o订单列表
 * @param Object params
 */
export const getList = (params) => {
    return request('POST', '/order/list', params);
};

/**
 * 获取o2o订单详情
 * @param String orderCrmId
 */
export const getDetail = (param) => {
    return request('POST', '/order/detail', param);
};
  