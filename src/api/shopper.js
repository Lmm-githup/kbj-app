import request from '@/utils/request';

/**
 * 获取草稿意见箱列表
 * @param Object params
 */
export const getDraftList = (param) => {
    return request('POST', '/guide/opinion/listDgb', param);
};

/**
 * 获取已提交、已反馈意见列表
 * @param String params
 */
export const getOptionList = (param) => {
    return request('POST', '/guide/opinion/list', param);
};

/**
 * 保存或提交导购意见
 * @param String params
 */
export const addOption = (param) => {
    return request('POST', '/guide/opinion/save', param);
};
  
/**
 * 提交导购意见
 * @param String params
 */
export const submitOption = (param) => {
    return request('POST', '/guide/opinion/submit', param);
};

/**
 * 获取意见详情 - 草稿
 * @param String params
 */
export const getOptionDetail = (param) => {
    return request('POST', '/guide/opinion/local/info', param);
};

/**
 * 获取意见详情
 * @param String params
 */
export const getSubmitOptionDetail = (param) => {
    return request('POST', '/guide/opinion/info', param);
};
  