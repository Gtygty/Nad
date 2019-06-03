import { axiosPost } from '@/utils/api';

/**
* @param page_index
* @param page_size
* @param order_by [optional]
* @param order_direction [optional]
* @link http://192.168.1.114:666/customer/my_customer/get_my_customer_paged
*/

export function getMyCustomerPaged(query) {
  return axiosPost('/customer/my_customer/get_my_customer_paged', query);
}

/**
* 获取客户验证信息
* @param user_id
* @link http://192.168.1.114:666/customer/my_customer/get_billing_info
*/

export function getBillingInfo(query) {
  return axiosPost('/customer/my_customer/get_billing_info', query);
}

/**
* 获取客户KYC信息
* @param user_id
* @link http://192.168.1.114:666/customer/my_customer/get_kyc_file
*/
export function getKycFile(query) {
  return axiosPost('/customer/my_customer/get_kyc_file', query);
}
