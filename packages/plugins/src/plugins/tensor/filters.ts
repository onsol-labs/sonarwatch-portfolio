import { GetProgramAccountsFilter } from '@solana/web3.js';
import { singleListingStruct } from './struct';

export const singleListingFilter = (
  owner: string
): GetProgramAccountsFilter[] => [
  { dataSize: singleListingStruct.byteSize },
  {
    memcmp: {
      bytes: owner,
      offset: 8,
    },
  },
];
