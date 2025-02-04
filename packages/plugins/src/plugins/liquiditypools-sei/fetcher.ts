import {
  NetworkId,
  PortfolioElement,
  PortfolioElementType,
  PortfolioLiquidity,
  getUsdValueSum,
} from '@sonarwatch/portfolio-core';
import { getCosmWasmClient } from '@sei-js/core';
import BigNumber from 'bignumber.js';
import { Cache } from '../../Cache';
import { Fetcher, FetcherExecutor } from '../../Fetcher';
import { pluginId } from './constants';
import { getUrlEndpoint } from '../../utils/clients/constants';
import { PlatformContracts } from './types';
import tokenPriceToAssetTokens from '../../utils/misc/tokenPriceToAssetTokens';
import getQueryBalanceByOwner from '../../utils/sei/getQueryBalanceByOwner';
import { Balance } from '../../utils/sei';

const executor: FetcherExecutor = async (owner: string, cache: Cache) => {
  const cosmWasmClient = await getCosmWasmClient(getUrlEndpoint(NetworkId.sei));

  const contractsByPlatform: Map<string, string[]> = new Map();
  const platformsContracts = await cache.getAllItems<PlatformContracts>({
    prefix: pluginId,
    networkId: NetworkId.sei,
  });
  if (!platformsContracts) return [];
  platformsContracts.forEach((platform) => {
    if (platform) {
      contractsByPlatform.set(platform.id, platform.contracts);
    }
  });

  const elements: PortfolioElement[] = [];

  for (const platform of contractsByPlatform.keys()) {
    const contracts = contractsByPlatform.get(platform);
    if (!contracts) continue;

    const liquidities: PortfolioLiquidity[] = [];

    for (const contract of contracts) {
      const tokenPrice = await cache.getTokenPrice(contract, NetworkId.sei);
      if (!tokenPrice) continue;

      const balance = (await cosmWasmClient.queryContractSmart(
        contract,
        getQueryBalanceByOwner(owner)
      )) as Balance;
      if (!balance) continue;

      const rawAmount = new BigNumber(balance.balance);
      if (rawAmount.isZero()) continue;

      const amount = rawAmount.div(10 ** tokenPrice.decimals).toNumber();

      const assets = tokenPriceToAssetTokens(
        contract,
        amount,
        NetworkId.solana,
        tokenPrice
      );
      const liquidity: PortfolioLiquidity = {
        assets,
        assetsValue: getUsdValueSum(assets.map((a) => a.value)),
        rewardAssets: [],
        rewardAssetsValue: 0,
        value: getUsdValueSum(assets.map((a) => a.value)),
        yields: [],
      };
      liquidities.push(liquidity);
    }
    if (liquidities.length === 0) continue;

    elements.push({
      type: PortfolioElementType.liquidity,
      networkId: NetworkId.sei,
      platformId: platform,
      name: 'Liquidities',
      label: 'LiquidityPool',
      value: getUsdValueSum(liquidities.map((a) => a.value)),
      data: {
        liquidities,
      },
    });
  }

  return elements;
};

const fetcher: Fetcher = {
  id: pluginId,
  networkId: NetworkId.sei,
  executor,
};

export default fetcher;
