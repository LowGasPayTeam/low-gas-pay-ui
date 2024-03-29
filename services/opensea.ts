import { request } from "./base";

export interface NFTCollection {
  contract: string;
  name: string;
  count: number;
  tokens: NFTToken[];
}

export interface NFTToken {
  image_original_url: string;
  image_preview_url: string;
  image_thumbnail_url: string;
  image_url: string;
  name: string;
  contract: string;
  collection_name: string;
  id: number | string;
}

const API_KEY = '23eaf1789d914c6f91f1fa03ee65455c';

const options = {
  method: 'GET',
  headers: {Accept: 'application/json', 'X-API-KEY': API_KEY}
};

const TESTNET_API = 'https://testnets-api.opensea.io/api/v1/assets';
const OPENSEA_API = 'https://api.opensea.io/api/v1/assets';

export const getAssetsByContract = (address: string, nftContract: string) => {
  const query = new URLSearchParams('order_direction=desc&limit=50&include_orders=false');
  query.set('owner', address);
  query.set('asset_contract_address', nftContract);
  query
  return fetch(`${TESTNET_API}?${query.toString()}`, { method: 'GET' })
    .then(response => response.json())
};

const ALLOWED_CONTRACTS = [
  '0xB74bf94049D2c01f8805B8b15Db0909168Cabf46',
  '0xd56e9203b218087038adb14f725630d9908b9eb0'
];

export const getAllowedNFTList = async () => {
  const res = await request({
    url: `/contracts`,
    method: 'GET',
  });
  return res.json();
}

export const getAllowedNFTS = async (address: string) => {
  let allowedNFTList = [];
  try {
    const res = await getAllowedNFTList();
    allowedNFTList = res.data;
  } catch (err) {
    console.log(err);
    allowedNFTList = ALLOWED_CONTRACTS;
  }
  const allNFTs = await Promise.all(
    ALLOWED_CONTRACTS.map(
      contract => getAssetsByContract(address, contract)
    )
  );

  return allNFTs.map(({ assets }) => {
    if (!assets.length) {
      return null;
    };
    return {
      contract: assets[0]?.asset_contract?.address ?? '',
      name: assets[0]?.asset_contract?.name ?? '',
      count: assets.length,
      tokens: assets.map((asset: any) => ({
        image_original_url: asset.image_original_url,
        image_preview_url: asset.image_preview_url,
        image_thumbnail_url: asset.image_thumbnail_url,
        image_url: asset.image_url,
        name: asset.name,
        id: asset.id,
        contract: asset?.asset_contract?.address,
        collection_name: asset?.asset_contract?.name,
      } as NFTToken)),
    } as NFTCollection;
  }).filter(item => !!item) as NFTCollection[];
};