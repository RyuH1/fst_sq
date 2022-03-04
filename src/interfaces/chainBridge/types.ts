// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Enum, Struct, U256, U8aFixed, Vec, u64, u8 } from '@polkadot/types-codec';
import type { AccountId } from '@polkadot/types/interfaces/runtime';

/** @name BridgeChainId */
export interface BridgeChainId extends u8 {}

/** @name BridgeTokenId */
export interface BridgeTokenId extends U256 {}

/** @name DepositNonce */
export interface DepositNonce extends u64 {}

/** @name ProposalStatus */
export interface ProposalStatus extends Enum {
  readonly isInitiated: boolean;
  readonly isApproved: boolean;
  readonly isRejected: boolean;
  readonly type: 'Initiated' | 'Approved' | 'Rejected';
}

/** @name ProposalVotes */
export interface ProposalVotes extends Struct {
  readonly votes_for: Vec<AccountId>;
  readonly votes_against: Vec<AccountId>;
  readonly status: ProposalStatus;
}

/** @name ResourceId */
export interface ResourceId extends U8aFixed {}

export type PHANTOM_CHAINBRIDGE = 'chainBridge';
