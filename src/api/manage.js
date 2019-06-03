import { axiosPost } from '@/utils/api';

/**
* get_all_department
* @param access-token
* @link system_manage/department_staff/get_all_department
*/

export function getAllDepartment(query) {
  return axiosPost('/system_manage/department_staff/get_all_department', query);
}


/**
* add_department
* @param access-token
* @param department_name
* @param parent_department_id[没有上级部门，不传或者传0]
* @param description[optional]
* @link system_manage/department_staff/add_department
*/

export function addDepartment(query) {
  return axiosPost('/system_manage/department_staff/add_department', query);
}


/**
* update_department
* @param access-token
* @param department_id
* @param department_name
* @param parent_department_id
* @param description[optional]
* @link system_manage/department_staff/update_department
*/

export function updateDepartment(query) {
  return axiosPost('/system_manage/department_staff/update_department', query);
}


/**
* delete_department
* @param access-token
* @param department_id
* @link system_manage/department_staff/delete_department
*/


export function deleteDepartment(query) {
  return axiosPost('/system_manage/department_staff/delete_department', query);
}


/**
* get_all_position_paged
* @param access_token
* @param page_index
* @param page_size
* @link system_manage/department_staff/get_all_position_paged
*/

export function getAllPositionPaged(query) {
  return axiosPost('/system_manage/department_staff/get_all_position_paged', query);
}

/**
* add_position
* @param access-token
* @param position_name
* @param department_id
* @param description[optional]
* @link system_manage/department_staff/add_position
*/

export function addPosition(query) {
  return axiosPost('/system_manage/department_staff/add_position', query);
}


/**
* update_position
* @param access-token
* @param department_id
* @param department_name
* @param description[optional]
* @link system_manage/department_staff/update_position
*/

export function updatePosition(query) {
  return axiosPost('/system_manage/department_staff/update_position', query);
}

/**
* delete_position
* @param access-token
* @param position_id
* @link system_manage/department_staff/delete_position
*/

export function deletePosition(query) {
  return axiosPost('/system_manage/department_staff/delete_position', query);
}

/**
* get_crm_user_paged
* @param access_token
* @param page_index
* @param page_size
* @param order_by[默认 position_id]
* @param order_direction[默认 asc]
* @link system_manage/department_staff/get_crm_user_paged
*/

export function getCrmUserPaged(query) {
  return axiosPost('/system_manage/department_staff/get_crm_user_paged', query);
}

/**
* get_user_paged_filter_option
* @param access-token
* @link system_manage/department_staff/get_user_paged_filter_option
*/

export function getUserPagedFilterOption(query) {
  return axiosPost('/system_manage/department_staff/get_user_paged_filter_option', query);
}


/**
* add_crm_user
* @param access_token
* @param first_name
* @param last_name
* @param email
* @param mobile
* @param password
* @param confirm_password
* @param position_id
* @param parent_user_id
* @param group_id
* @param is_disabled
* @link system_manage/department_staff/add_crm_user
*/

export function addCrmUser(query) {
  return axiosPost('/system_manage/department_staff/add_crm_user', query);
}

/**
* update_crm_user
* @param access-token
* @param crm_user_id
* @param first_name
* @param last_name
* @param email
* @param mobile
* @param password
* @param confirm_password
* @param position_id
* @param parent_user_id
* @param group_id
* @param is_disabled
* @link system_manage/department_staff/update_crm_user
*/

export function updateCrmUser(query) {
  return axiosPost('/system_manage/department_staff/update_crm_user', query);
}

/**
* batch_update_crm_user
* @param access-token
* @param crm_user_id[array]
* @param batch_operate[update_password,update_position,update_header,update_group,update_status]
* @param password
* @param confirm_password
* @param position_id
* @param parent_user_id
* @param group_id
* @param is_disabled
* @link system_manage/department_staff/batch_update_crm_user
*/

export function batchUpdateCrmUser(query) {
  return axiosPost('/system_manage/department_staff/batch_update_crm_user', query);
}

/**
* update_crm_user_password
* @param access-token
* @param crm_user_id
* @param password
* @param confirm_password
* @link system_manage/department_staff/update_crm_user_password
*/

export function updateCrmUserPassword(query) {
  return axiosPost('/system_manage/department_staff/update_crm_user_password', query);
}

/**
* 启用或者禁用员工
* update_crm_user_status
* @param access-token
* @param crm_user_id
* @param is_disabled[0-启用；1-禁用]
* @link system_manage/department_staff/update_crm_user_status
*/

export function updateCrmUserStatus(query) {
  return axiosPost('/system_manage/department_staff/update_crm_user_status', query);
}

/**
* get_all_user_group
* @param access-token
* @link system_manage/staff_permission/get_all_user_group
*/

export function getAllUserGroup(query) {
  return axiosPost('/system_manage/staff_permission/get_all_user_group', query);
}

/**
* add_user_group
* @param access-token
* @param group_name
* @param description
* @link system_manage/staff_permission/add_user_group
*/

export function addUserGroup(query) {
  return axiosPost('/system_manage/staff_permission/add_user_group', query);
}


/**
* update_user_group
* @param access-token
* @param group_id
* @param group_name
* @param description
* @link system_manage/staff_permission/update_user_group
*/

export function updateUserGroup(query) {
  return axiosPost('/system_manage/staff_permission/update_user_group', query);
}
