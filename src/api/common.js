import request from '@/utils/request';


/**
 * 获取通用下拉列表
 * @param {string} [dataType] 
 * @value 'POSITION_TYPE' 职位类型
 * @returns
 */
export const commonLov = ({
  dataType
}) => {
  return request('POST', '/common/lov', {
    dataType
  });
};

/**
 * base64 上传图片
 * @param {string} [dataType] 
 */
export const uploadImgByBase64 = (params) => {
  return request('POST', '/common/upload/base64', params);
};

/**
 * 获取版本号
 * @param {string} [dataType] 
 */
export const getVersion = (params) => {
  return request('POST', 'app/version/validation', params);
};
