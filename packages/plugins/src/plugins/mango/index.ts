import { Platform } from '@sonarwatch/portfolio-core';
import { Fetcher } from '../../Fetcher';
import { Job } from '../../Job';
import banksJob from './banksJob';
import groupsJob from './groupsJob';
import collateralFetcher from './collateralFetcher';
import redeemFetcher from './redeemFetcher';
import { mangoPlatform } from './constants';

export const platforms: Platform[] = [mangoPlatform];
export const jobs: Job[] = [banksJob, groupsJob];
export const fetchers: Fetcher[] = [collateralFetcher, redeemFetcher];
