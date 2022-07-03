import { request } from "./base";

export interface Transaction {
  token_amount:    string;
  token_contract:  string;
  from_addr:       string;
  gas_paid_amount: string;
  gas_paid_status: string;
  gas_used:        string;
  status:          string;
  to_addr:         string;
}

export interface NFTTransaction {
  collection_name: string;
  token_name:      string;
  token_id:        string | number;
  token_contract:  string;
  from_addr:       string;
  gas_paid_amount: string;
  gas_paid_status: string;
  gas_used:        string;
  status:          string;
  to_addr:         string;
}


/**
 * 创建 Token 订单
 * 
 * @export
 * @interface CreateOrderParams
 */
export interface CreateOrderParams {
  order_create_addr: string;
  order_gas_type:    string;
  transactions:      Transaction[] | NFTTransaction[];
}

export interface TokenOrdersRes {
  code:    number;
  data:    TokenOrdersItem[];
  message: null;
}

export interface TokenOrdersItem {
  created_at:          string;
  deleted:             number;
  order_create_addr:   string;
  order_exec_id:       null;
  order_exec_status:   null;
  order_gas_type:      string;
  order_id:            number;
  order_status:        string;
  trans_begin_time:    null;
  trans_end_time:      null;
  trans_gas_fee_limit: null;
  trans_gas_fee_max:   null;
  transactions:        Transaction[];
  updated_at:          string;
}

export interface NFTOrdersItem {
  created_at:          string;
  deleted:             number;
  order_create_addr:   string;
  order_exec_id:       null;
  order_exec_status:   null;
  order_gas_type:      string;
  order_id:            number;
  order_status:        string;
  trans_begin_time:    null;
  trans_end_time:      null;
  trans_gas_fee_limit: null;
  trans_gas_fee_max:   null;
  transactions:        NFTTransaction[];
  updated_at:          string;
}

export async function createOrder(params: CreateOrderParams): Promise<TokenOrdersItem> {
  const res = await request<CreateOrderParams>({
    url: '/tokens',
    method: 'POST',
    data: params,
  });
  return res.json();
}

/**
 * 获取 Token 订单列表
 * 
 * @export
 * @interface GetTokenOrdersParams
 */
export interface GetTokenOrdersParams {
  pageNumber: number;
  pageSize?: number;
  address: string;
}

export async function getTokenOrders(params: GetTokenOrdersParams) {
  const {
    pageNumber = 1,
    pageSize = 20,
    address = ''
  } = params;
  const res = await request({
    url: `/tokens?page=${pageNumber}&size=${pageSize}&address=${address}`,
    method: 'GET',
    data: null
  });
  return res.json();
}

/**
 * 删除 Token 订单
 * 
 * @param orderId
 * @returns 
 */
export const delTokenOrder = async (orderId: string) => {
  const res = await request({
    url: `/tokens/${orderId}`,
    method: 'DELETE',
    data: null
  });
  return res.json();
}

/**
 * 取消 Token 订单
 * 
 * @param orderId 
 * @returns 
 */
export const cancelTokenOrder = async (orderId: string) => {
  const res = await request({
    url: `/tokens/${orderId}`,
    method: 'PUT',
    data: { order_status: 'Created' }
  });
  return res.json();
}

/**
 * 创建 NFT 订单
 * 
 * @param CreateOrderParams 
 * @returns 
 */
export async function createNFTOrder(params: CreateOrderParams): Promise<NFTOrdersItem> {
  const res = await request<CreateOrderParams>({
    url: '/nfts',
    method: 'POST',
    data: params,
  });
  return res.json();
}

/**
 * 获取 NFT 订单
 * 
 * @param GetNFTOrdersParams 
 * @returns 
 */
export interface GetNFTOrdersParams {
  pageNumber: number;
  pageSize?: number;
  address: string;
}

export async function getNFTOrders(params: GetNFTOrdersParams) {
  const {
    pageNumber = 1,
    pageSize = 20,
    address = ''
  } = params;
  const res = await request({
    url: `/nfts?page=${pageNumber}&size=${pageSize}&address=${address}`,
    method: 'GET',
    data: null
  });
  return res.json();
}

/**
 * 删除 Token 订单
 * 
 * @param orderId
 * @returns 
 */
export const delNFTOrder = async (orderId: string) => {
  const res = await request({
    url: `/nfts/${orderId}`,
    method: 'DELETE',
    data: null
  });
  return res.json();
}

/**
 * 取消 Token 订单
 * 
 * @param orderId 
 * @returns 
 */
export const cancelNFTOrder = async (orderId: string) => {
  const res = await request({
    url: `/nfts/${orderId}`,
    method: 'PUT',
    data: { order_status: 'Created' }
  });
  return res.json();
}