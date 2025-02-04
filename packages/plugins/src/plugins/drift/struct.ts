import {
  BeetStruct,
  bool,
  i32,
  u16,
  u32,
  u8,
  uniformFixedSizeArray,
} from '@metaplex-foundation/beet';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { blob, i64, u128, u64 } from '../../utils/solana';

export enum OrderTriggerCondition {
  Above,
  Below,
  TriggeredAbove,
  TriggeredBelow,
}

export enum PositionDirection {
  Long,
  Short,
}

export enum MarketType {
  Spot,
  Perp,
}

export enum OrderType {
  Market,
  Limit,
  TriggerMarket,
  TriggerLimit,
  Oracle,
}

export enum OrderStatus {
  Init,
  Open,
  Filled,
  Canceled,
}

export enum SpotBalanceType {
  Deposit,
  Borrow,
}

export enum UserStatus {
  Active,
  BeingLiquidated,
  Bankrupt,
}

export enum AssetTier {
  Collateral,
  Protected,
  Cross,
  Isolated,
  Unlisted,
}

export enum MarketStatus {
  Initialized,
  Active,
  FundingPaused,
  AmmPaused,
  FillPaused,
  WithdrawPaused,
  ReduceOnly,
  Settlement,
  Delisted,
}

export enum OracleSource {
  Pyth,
  Switchboard,
  QuoteAsset,
  Pyth1K,
  Pyth1M,
  PythStableCoin,
}

export type Order = {
  slot: BigNumber;
  price: BigNumber;
  baseAssetAmount: BigNumber;
  baseAssetAmountFilled: BigNumber;
  quoteAssetAmountFilled: BigNumber;
  triggerPrice: BigNumber;
  auctionStartPrice: BigNumber;
  auctionEndPrice: BigNumber;
  maxTs: BigNumber;
  oraclePriceOffset: BigNumber;
  orderId: BigNumber;
  marketIndex: number;
  status: OrderStatus;
  orderType: OrderType;
  marketType: MarketType;
  userOrderId: number;
  existingPositionDirection: PositionDirection;
  direction: PositionDirection;
  reduceOnly: boolean;
  postOnly: boolean;
  immediateOrCancel: boolean;
  triggerCondition: OrderTriggerCondition;
  auctionDuration: number;
  padding: number;
};

export const orderStruct = new BeetStruct<Order>(
  [
    ['slot', u64],
    ['price', u64],
    ['baseAssetAmount', u64],
    ['baseAssetAmountFilled', u64],
    ['quoteAssetAmountFilled', u64],
    ['triggerPrice', u64],
    ['auctionStartPrice', i64],
    ['auctionEndPrice', i64],
    ['maxTs', i64],
    ['oraclePriceOffset', i32],
    ['orderId', u32],
    ['marketIndex', u16],
    ['status', u8],
    ['orderType', u8],
    ['marketType', u8],
    ['userOrderId', u8],
    ['existingPositionDirection', u8],
    ['direction', u8],
    ['reduceOnly', bool],
    ['postOnly', bool],
    ['immediateOrCancel', bool],
    ['triggerCondition', u8],
    ['auctionDuration', u8],
    ['padding', u8],
  ],
  (args) => args as Order
);

export type PerpPosition = {
  lastCumulativeFundingRate: BigNumber;
  baseAssetAmount: BigNumber;
  quoteAssetAmount: BigNumber;
  quoteBreakEvenAmount: BigNumber;
  quoteEntryAmount: BigNumber;
  openBids: BigNumber;
  openAsks: BigNumber;
  settledPnl: BigNumber;
  lpShares: BigNumber;
  lastBaseAssetAmountPerLp: BigNumber;
  lastQuoteAssetAmountPerLp: BigNumber;
  remainderBaseAssetAmount: BigNumber;
  marketIndex: number;
  openOrders: number;
  padding: number[];
};

export const perpPositionStruct = new BeetStruct<PerpPosition>(
  [
    ['lastCumulativeFundingRate', i64],
    ['baseAssetAmount', i64],
    ['quoteAssetAmount', i64],
    ['quoteBreakEvenAmount', i64],
    ['quoteEntryAmount', i64],
    ['openBids', i64],
    ['openAsks', i64],
    ['settledPnl', i64],
    ['lpShares', u64],
    ['lastBaseAssetAmountPerLp', i64],
    ['lastQuoteAssetAmountPerLp', i64],
    ['remainderBaseAssetAmount', i32],
    ['marketIndex', u16],
    ['openOrders', u8],
    ['padding', uniformFixedSizeArray(u8, 1)],
  ],
  (args) => args as PerpPosition
);

export type PoolBalance = {
  scaledBalance: BigNumber;
  marketIndex: number;
  padding: number[];
};

export const poolBalanceStruct = new BeetStruct<PoolBalance>(
  [
    ['scaledBalance', u128],
    ['marketIndex', u16],
    ['padding', uniformFixedSizeArray(u8, 6)],
  ],
  (args) => args as PoolBalance
);

export type HistoricalIndexData = {
  lastIndexBidPrice: BigNumber;
  lastIndexAskPrice: BigNumber;
  lastIndexPriceTwap: BigNumber;
  lastIndexPriceTwap5min: BigNumber;
  lastIndexPriceTwapTs: BigNumber;
};

export const historicalIndexDataStruct = new BeetStruct<HistoricalIndexData>(
  [
    ['lastIndexBidPrice', u64],
    ['lastIndexAskPrice', u64],
    ['lastIndexPriceTwap', u64],
    ['lastIndexPriceTwap5min', u64],
    ['lastIndexPriceTwapTs', i64],
  ],
  (args) => args as HistoricalIndexData
);

export type HistoricalOracleData = {
  lastOraclePrice: BigNumber;
  lastOracleConf: BigNumber;
  lastOracleDelay: BigNumber;
  lastOraclePriceTwap: BigNumber;
  lastOraclePriceTwap5Min: BigNumber;
  lastOraclePriceTwapTs: BigNumber;
};

export const historicalOracleDataStruct = new BeetStruct<HistoricalOracleData>(
  [
    ['lastOraclePrice', i64],
    ['lastOracleConf', u64],
    ['lastOracleDelay', i64],
    ['lastOraclePriceTwap', i64],
    ['lastOraclePriceTwap5Min', i64],
    ['lastOraclePriceTwapTs', i64],
  ],
  (args) => args as HistoricalOracleData
);

export type InsuranceFund = {
  vault: PublicKey;
  totalShares: BigNumber;
  uszrShares: BigNumber;
  sharesBase: BigNumber;
  unstakingPeriod: BigNumber;
  lastRevenueSettleTs: BigNumber;
  revenueSettlePeriod: BigNumber;
  totalFactor: number;
  userFactor: number;
};

export const insuranceFundStruct = new BeetStruct<InsuranceFund>(
  [
    ['vault', publicKey],
    ['totalShares', u128],
    ['uszrShares', u128],
    ['sharesBase', u128],
    ['unstakingPeriod', i64],
    ['lastRevenueSettleTs', i64],
    ['revenueSettlePeriod', i64],
    ['totalFactor', u32],
    ['userFactor', u32],
  ],
  (args) => args as InsuranceFund
);

export type SpotMarket = {
  buffer: Buffer;
  pubkey: PublicKey;
  oracle: PublicKey;
  mint: PublicKey;
  vault: PublicKey;
  name: number[];
  historicalOracleData: HistoricalOracleData;
  historicalIndexData: HistoricalIndexData;
  revenuePool: PoolBalance;
  spotFeePool: PoolBalance;
  insuranceFund: InsuranceFund;
  totalSpotFee: BigNumber;
  depositBalance: BigNumber;
  borrowBalance: BigNumber;
  cumulativeDepositInterest: BigNumber;
  cumulativeBorrowInterest: BigNumber;
  totalSocialLoss: BigNumber;
  totalQuoteSocialLoss: BigNumber;
  withdrawGuardThreshold: BigNumber;
  maxTokenDeposits: BigNumber;
  depositTokenTwap: BigNumber;
  borrowTokenTwap: BigNumber;
  utilizationTwap: BigNumber;
  lastInterestTs: BigNumber;
  lastTwapTs: BigNumber;
  expiryTs: BigNumber;
  orderStepSize: BigNumber;
  orderTickSize: BigNumber;
  minOrderSize: BigNumber;
  maxPositionSize: BigNumber;
  nextFillRecordId: BigNumber;
  nextDepositRecordId: BigNumber;
  initialAssetWeight: number;
  maintenanceAssetWeight: number;
  initialLiabilityWeight: number;
  maintenanceLiabilityWeight: number;
  imfFactor: number;
  liquidatorFee: number;
  ifLiquidationFee: number;
  optimalUtilization: number;
  optimalBorrowRate: number;
  maxBorrowRate: number;
  decimals: number;
  marketIndex: number;
  ordersEnabled: boolean;
  oracleSource: OracleSource;
  status: MarketStatus;
  assetTier: AssetTier;
  padding1: number[];
  flashLoanAmount: BigNumber;
  flashLoanInitialTokenAmount: BigNumber;
  totalSwapFee: BigNumber;
  padding: Buffer[];
};

export const spotMarketStruct = new BeetStruct<SpotMarket>(
  [
    ['buffer', blob(8)],
    ['pubkey', publicKey],
    ['oracle', publicKey],
    ['mint', publicKey],
    ['vault', publicKey],
    ['name', uniformFixedSizeArray(u8, 32)],
    ['historicalOracleData', historicalOracleDataStruct],
    ['historicalIndexData', historicalIndexDataStruct],
    ['revenuePool', poolBalanceStruct],
    ['spotFeePool', poolBalanceStruct],
    ['insuranceFund', insuranceFundStruct],
    ['totalSpotFee', u128],
    ['depositBalance', u128],
    ['borrowBalance', u128],
    ['cumulativeDepositInterest', u128],
    ['cumulativeBorrowInterest', u128],
    ['totalSocialLoss', u128],
    ['totalQuoteSocialLoss', u128],
    ['withdrawGuardThreshold', u64],
    ['maxTokenDeposits', u64],
    ['depositTokenTwap', u64],
    ['borrowTokenTwap', u64],
    ['utilizationTwap', u64],
    ['lastInterestTs', u64],
    ['lastTwapTs', u64],
    ['expiryTs', i64],
    ['orderStepSize', u64],
    ['orderTickSize', u64],
    ['minOrderSize', u64],
    ['maxPositionSize', u64],
    ['nextFillRecordId', u64],
    ['nextDepositRecordId', u64],
    ['initialAssetWeight', u32],
    ['maintenanceAssetWeight', u32],
    ['initialLiabilityWeight', u32],
    ['maintenanceLiabilityWeight', u32],
    ['imfFactor', u32],
    ['liquidatorFee', u32],
    ['ifLiquidationFee', u32],
    ['optimalUtilization', u32],
    ['optimalBorrowRate', u32],
    ['maxBorrowRate', u32],
    ['decimals', u32],
    ['marketIndex', u16],
    ['ordersEnabled', bool],
    ['oracleSource', u8],
    ['status', u8],
    ['assetTier', u8],
    ['padding1', uniformFixedSizeArray(u8, 6)],
    ['flashLoanAmount', u64],
    ['flashLoanInitialTokenAmount', u64],
    ['totalSwapFee', u64],
    ['padding', uniformFixedSizeArray(u8, 56)],
  ],
  (args) => args as SpotMarket
);

export type SpotPosition = {
  scaledBalance: BigNumber;
  openBids: BigNumber;
  openAsks: BigNumber;
  cumulativeDeposits: BigNumber;
  marketIndex: number;
  balanceType: SpotBalanceType;
  openOrders: number;
  padding: number[];
};
export const spotPositionStruct = new BeetStruct<SpotPosition>(
  [
    ['scaledBalance', u64],
    ['openBids', i64],
    ['openAsks', i64],
    ['cumulativeDeposits', i64],
    ['marketIndex', u16],
    ['balanceType', u8],
    ['openOrders', u8],
    ['padding', uniformFixedSizeArray(u8, 4)],
  ],
  (args) => args as SpotPosition
);

export type UserAccount = {
  buffer: Buffer;
  authority: PublicKey;
  delegate: PublicKey;
  name: number[];
  spotPositions: SpotPosition[];
  perpPositions: PerpPosition[];
  orders: Order[];
  lastAddPerpLpSharesTs: BigNumber;
  totalDeposits: BigNumber;
  totalWithdraws: BigNumber;
  totalSocialLoss: BigNumber;
  settledPerpPnl: BigNumber;
  cumulativeSpotFees: BigNumber;
  cumulativePerpFunding: BigNumber;
  liquidationMarginFreed: BigNumber;
  lastActiveSlot: BigNumber;
  nextOrderId: number;
  maxMarginRatio: number;
  nextLiquidationId: number;
  subAccountId: number;
  status: UserStatus;
  isMarginTradingEnabled: boolean;
  idle: boolean;
  openOrders: number;
  hasOpenOrder: boolean;
  openAuctions: number;
  hasOpenAuction: boolean;
  padding: number[];
};

export const userAccountStruct = new BeetStruct<UserAccount>(
  [
    ['buffer', blob(8)],
    ['authority', publicKey],
    ['delegate', publicKey],
    ['name', uniformFixedSizeArray(u8, 32)],
    ['spotPositions', uniformFixedSizeArray(spotPositionStruct, 8)],
    ['perpPositions', uniformFixedSizeArray(perpPositionStruct, 8)],
    ['orders', uniformFixedSizeArray(orderStruct, 32)],
    ['lastAddPerpLpSharesTs', i64],
    ['totalDeposits', u64],
    ['totalWithdraws', u64],
    ['totalSocialLoss', u64],
    ['settledPerpPnl', i64],
    ['cumulativeSpotFees', i64],
    ['cumulativePerpFunding', i64],
    ['liquidationMarginFreed', u64],
    ['lastActiveSlot', u64],
    ['nextOrderId', u32],
    ['maxMarginRatio', u32],
    ['nextLiquidationId', u16],
    ['subAccountId', u16],
    ['status', u8],
    ['isMarginTradingEnabled', bool],
    ['idle', bool],
    ['openOrders', u8],
    ['hasOpenOrder', bool],
    ['openAuctions', u8],
    ['hasOpenAuction', bool],
    ['padding', uniformFixedSizeArray(u8, 21)],
  ],
  (args) => args as UserAccount
);
