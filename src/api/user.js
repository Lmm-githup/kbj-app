import request from '@/utils/request';

// 登陆模块api

export const login = ({
  loginName,
  loginPwd,
  udId,
  mobileType
}) => {
  return request('POST', '/user/login', {
    loginName,
    loginPwd,
    udId,
    mobileType
  });
};
/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return request('POST', '/user/info', {});
};

/**
 * 修改密码
 * @param {string} [oldPwd] 旧密码
 * @param {string} [loginPwd] 新密码
 * @returns
 */
export const editUserPassword = (
  oldPwd,
  loginPwd
) => {
  return request('POST', '/user/update/pwd', {
    oldPwd,
  loginPwd
  });
};




/**
 * 添加员工
 * @param {string} [userCode] 员工编号
 * @param {string} [userName] 员工姓名
 * @param {string} [loginPwd] 登录密码
 * @param {string} [orgNo] 部门编号
 * @param {string} [positionNo] 职位编号
 * @param {string} [mobile] 手机号
 * @param {string} [email] 邮箱
 * @returns
 */
export const addStaff = ({
  userCode,
  userName,
  loginPwd,
  orgNo,
  positionNo,
  mobile,
  email,
}) => {
  return request('POST', '/user/emp/save', {
    userCode,
    userName,
    loginPwd,
    orgNo,
    positionNo,
    mobile,
    email,
  });
};

/**
 * 修改员工
 * @param {string} [userCode] 员工编号
 * @param {string} [userName] 员工姓名
 * @param {string} [orgNo] 部门编号
 * @param {string} [positionNo] 职位编号
 * @param {string} [mobile] 手机号
 * @param {string} [email] 邮箱
 * @returns
 */
export const updateStaff = ({
  userNo,
  userName,
  orgNo,
  positionNo,
  mobile,
  email,
}) => {
  return request('POST', '/user/emp/update', {
    userNo,
    userName,
    orgNo,
    positionNo,
    mobile,
    email,
  });
};

/**
 * 查询员工列表
 * @param {string} [userStatus] 员工状态（1：正常，2：禁用）
 * @param {string} [orgNo] 部门编号
 * @param {string} [positionNo] 职位编号
 * @param {string} [orderByColumn] 排序字段（join：加入时间，loginTime：最后登陆时间，loginCount：登陆次数，userName：姓名，org：部门，position：职位）
 * @param {string} [orderByType] 排序类型（asc：正序，desc：倒序）
 * @param {string} [currentPage] 分页页码
 * @param {string} [pageSize] 每页数据量
 * @returns
 */
export const queryStaffList = ({
  userStatus,
  orgNo,
  positionNo,
  orderByColumn,
  orderByType,
  currentPage,
  pageSize,
  queryType,
}) => {
  return request('POST', '/user/emp/list', {
    userStatus,
    orgNo,
    positionNo,
    orderByColumn,
    orderByType,
    currentPage,
    pageSize,
    queryType,
  });
};

/**
 * 重置员工密码
 * @param {string} [userNo] 用户编号
 * @returns
 */
export const resetPassword = ({
  userNo
}) => {
  return request('POST', '/user/emp/reset/pwd', {
    userNo
  });
};

/**
 * 删除员工
 * @param {string} [userNo] 用户编号
 * @returns
 */
export const deleteStaff = ({
  userNo
}) => {
  return request('POST', '/user/emp/delete', {
    userNo
  });
};


/**
 * 查询员工详情
 * @param {string} [userNo] 用户编号
 * @returns
 */
export const queryStaffDetail = ({
  userNo
}) => {
  return request('POST', '/user/emp/detail', {
    userNo
  });
};

/**
 * 添加/编辑部门
 */
export const saveOrg = ({
  parentRow,
  orgName,
  orgCode,
  sortSn,
  remark
}) => {
  return request('POST', '/org/save', {
    parentRow,
    orgName,
    orgCode,
    sortSn,
    remark
  });
};

/**
 * 删除部门
 */
export const deleteOrg = ({
  rowNo
}) => {
  return request('POST', '/org/delete', {
    rowNo
  });
};

/**
 * 修改部门
 */
export const editOrg = ({
  rowNo,
  orgCode,
  orgName,
  parentRow,
  sortSn
}) => {
  return request('POST', '/org/update', {
    rowNo,
    orgCode,
    orgName,
    parentRow,
    sortSn
  });
};


/**
 * 新建职位
 * @param {string} [positionType] 职位类型
 * @param {string} [positionName] 职位名称
 * @param {string} [positionCode] 职位编码
 * @param {string} [parentPositionNo] 上级职位号
 * @returns
 */
export const savePosition = ({
  positionType,
  positionName,
  positionCode,
  parentPositionNo
}) => {
  return request('POST', '/position/save', {
    positionType,
    positionName,
    positionCode,
    parentPositionNo
  });
};

/**
 * 查询职位列表
 */
export const getPositionList = ({
  currentPage
}) => {
  return request('POST', '/position/list', {currentPage});
};


/**
 * 查询部门列表
 */
export const getOrgList = (params) => {
  return request('POST', '/org/list', params);
};

/**
 * 修改职位类型
 * @param {string} [positionType] 职位类型
 * @param {string} [positionTypeName] 职位类型名称
 * @returns
 */
export const updatePositionType = ({
  positionType,
  positionTypeName
}) => {
  return request('POST', '/position/type/update', {
    positionType,
  positionTypeName
  });
};

/**
 * 修改职位类型
 * @param {string} [positionType] 职位类型
 * @returns
 */
export const getPositionAuth = ({
  positionType
}) => {
  return request('POST', '/position/auth/list', {
    positionType
  });
};

/**
 * 修改职位类型
 * @param {string} [positionType] 职位类型
 * @param {string} [moduleList] 职位类型名称
 * @returns
 */
export const savePositionAuth = ({
  positionType,
  moduleList
}) => {
  return request('POST', '/position/auth/save', {
    positionType,
    moduleList
  });
};

/**
 * 修改用户信息
 * @param {string} [email] 邮箱
 * @param {string} [sex] 性别 1男2女
 * @param {string} [birthday] 出生日期
 * @param {string} [userHeadimg] 头像
 * @returns
 */
export const editUserInfo = (
  email,
  sex,
  birthday,
  userHeadimg
) => {
  return request('POST', '/user/update/info', {
    email,
    sex,
    birthday,
    userHeadimg
  });
};

export const logout = () => {
  return request('GET', '/user/logout', {});
};


export const myQrcode = () => {
  return request('POST', '/org/qrCode', {});
};
