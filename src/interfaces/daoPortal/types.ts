// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Enum, Option, Struct, Text, U256, Vec, bool, u32, u64, u8 } from '@polkadot/types-codec';
import type { AccountId, H160 } from '@polkadot/types/interfaces/runtime';

/** @name Chain */
export interface Chain extends Struct {
  readonly _protocol: Protocol;
}

/** @name ChainIndex */
export interface ChainIndex extends u32 {}

/** @name CrossChainAccount */
export interface CrossChainAccount extends Enum {
  readonly isSolidity: boolean;
  readonly asSolidity: H160;
  readonly isSubstrate: boolean;
  readonly asSubstrate: AccountId;
  readonly type: 'Solidity' | 'Substrate';
}

/** @name DAOProposal */
export interface DAOProposal extends Struct {
  readonly _author: CrossChainAccount;
  readonly _voting_format: VotingFormat;
  readonly _option_count: OptionIndex;
  readonly _data: IpfsHash;
  readonly _privacy: PrivacyLevel;
  readonly _start: u64;
  readonly _end: u64;
  readonly _frequency: Option<u64>;
  readonly state: DAOProposalState;
}

/** @name DAOProposalState */
export interface DAOProposalState extends Struct {
  readonly finalized: bool;
  readonly snapshots: Vec<U256>;
  readonly blacklisted: bool;
  readonly votes: Vec<VotingPower>;
  readonly pub_voters: Option<IpfsHash>;
  readonly updates: u32;
}

/** @name IpfsHash */
export interface IpfsHash extends Text {}

/** @name OptionIndex */
export interface OptionIndex extends u8 {}

/** @name PrivacyLevel */
export interface PrivacyLevel extends Enum {
  readonly isOpaque: boolean;
  readonly asOpaque: u8;
  readonly isRank: boolean;
  readonly isPrivate: boolean;
  readonly isPublic: boolean;
  readonly isMixed: boolean;
  readonly type: 'Opaque' | 'Rank' | 'Private' | 'Public' | 'Mixed';
}

/** @name Project */
export interface Project extends Struct {
  readonly usergroup: UserGroup;
  readonly data: IpfsHash;
  readonly workspaces: Vec<Workspace>;
}

/** @name ProjectId */
export interface ProjectId extends u32 {}

/** @name ProposalId */
export interface ProposalId extends u32 {}

/** @name Protocol */
export interface Protocol extends Enum {
  readonly isSolidity: boolean;
  readonly isSubstrate: boolean;
  readonly type: 'Solidity' | 'Substrate';
}

/** @name SolidityStrategy */
export interface SolidityStrategy extends Enum {
  readonly isErc20Balance: boolean;
  readonly asErc20Balance: H160;
  readonly type: 'Erc20Balance';
}

/** @name Strategy */
export interface Strategy extends Enum {
  readonly isSolidity: boolean;
  readonly asSolidity: SolidityStrategy;
  readonly isSubstrate: boolean;
  readonly asSubstrate: SubstrateStrategy;
  readonly type: 'Solidity' | 'Substrate';
}

/** @name SubstrateStrategy */
export interface SubstrateStrategy extends Enum {
  readonly isNativeBalance: boolean;
  readonly type: 'NativeBalance';
}

/** @name UserGroup */
export interface UserGroup extends Struct {
  readonly owner: CrossChainAccount;
  readonly admins: Vec<CrossChainAccount>;
  readonly maintainers: Vec<CrossChainAccount>;
  readonly proposers: Option<Vec<CrossChainAccount>>;
}

/** @name VoteUpdate */
export interface VoteUpdate extends Struct {
  readonly project: ProjectId;
  readonly proposal: ProposalId;
  readonly votes: Vec<VotingPower>;
  readonly pub_voters: Option<IpfsHash>;
}

/** @name VotingFormat */
export interface VotingFormat extends Enum {
  readonly isSingleChoice: boolean;
  readonly isSplitVote: boolean;
  readonly type: 'SingleChoice' | 'SplitVote';
}

/** @name VotingPower */
export interface VotingPower extends U256 {}

/** @name Workspace */
export interface Workspace extends Struct {
  readonly _chain: ChainIndex;
  readonly strategies: Vec<Strategy>;
}

export type PHANTOM_DAOPORTAL = 'daoportal';
