export const BADGE_WIDTH = 185;
export const BADGE_HEIGHT = 220;

export const REGULAR_TOTAL_BADGE_COUNT = 25; // this number should never be lower than the total count returned by default profile, so that new users can always save their initial profile
export const PREMIUM_TOTAL_BADGE_COUNT = 50;

export enum Routes {
  HOME = '/',
  TRENDING = '/trending',
  SHOP = '/shop',
  PROFILE = '/profiles/:address',
}

export const ZeroAddress = '0x0000000000000000000000000000000000000000';

export enum StoreAssets {
  PREMIUM = '1',
  BETA_TESTER = '2',
}

export enum Blockchains {
  ETHEREUM = 'ethereum',
  POLYGON = 'polygon',
  ARBITRUM = 'arbitrum',
  OPTIMISM = 'optimism',
}

export enum Interfaces {
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
  ENS_REGISTRAR = 'ENS_REGISTRAR',
  SUSHISWAP_EXCHANGE = 'SUSHISWAP_EXCHANGE',
  UNISWAP_V2_EXCHANGE = 'UNISWAP_V2_EXCHANGE',
  UNISWAP_V3_EXCHANGE = 'UNISWAP_V3_EXCHANGE',
  ROCKET_POOL = 'ROCKET_POOL',
}

export enum InteractionTypes {
  CONTRACT_CREATION = 'CONTRACT_CREATION',
  SEND_ETHER = 'SEND_ETHER',
}

export enum StatisticTypes {
  SWAP = 'SWAP',
  STAKE = 'STAKE',
}

export enum AsyncStates {
  READY = 'READY',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  FULFILLED = 'FULFILLED',
}

export enum Toasts {
  ADDING_BADGE = 'ADDING_BADGE',
  ADDING_PROFILE_PICTURE = 'ADDING_PROFILE_PICTURE',
  ADDING_ACHIEVEMENT = 'ADDING_ACHIEVEMENT',
  SUCCESS_SUBMITTING_PURCHASE = 'SUCCESS_SUBMITTING_PURCHASE',
  ERROR_SUBMITTING_PURCHASE = 'ERROR_SUBMITTING_PURCHASE',
  ERROR_LOADING_PAGE = 'ERROR_LOADING_PAGE',
  ERROR_SAVING_PROFILE = 'ERROR_SAVING_PROFILE',
}

export enum ToastStatuses {
  INFO = 'info',
  WARNING = 'warning',
  SUCCESS = 'success',
  ERROR = 'error',
}
