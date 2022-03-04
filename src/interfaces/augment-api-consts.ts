// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

import type { ApiTypes } from '@polkadot/api-base/types';
import type { Vec, bool, u16, u32, u64 } from '@polkadot/types-codec';
import type { Balance, BalanceOf, BlockNumber, LockIdentifier, Moment, PalletId, Perbill, Permill, RuntimeDbWeight, TransactionPriority, Weight } from '@polkadot/types/interfaces/runtime';
import type { SessionIndex } from '@polkadot/types/interfaces/session';
import type { EraIndex } from '@polkadot/types/interfaces/staking';
import type { RuntimeVersion } from '@polkadot/types/interfaces/state';
import type { WeightToFeeCoefficient } from '@polkadot/types/interfaces/support';
import type { BlockLength, BlockWeights } from '@polkadot/types/interfaces/system';
import type { BridgeChainId, ResourceId } from 'finitestate/interfaces/chainBridge';

declare module '@polkadot/api-base/types/consts' {
  export interface AugmentedConsts<ApiType extends ApiTypes> {
    authorship: {
      /**
       * The number of blocks back we should accept uncles.
       * This means that we will deal with uncle-parents that are
       * `UncleGenerations + 1` before `now`.
       **/
      uncleGenerations: BlockNumber & AugmentedConst<ApiType>;
    };
    babe: {
      /**
       * The amount of time, in slots, that each epoch should last.
       * NOTE: Currently it is not possible to change the epoch duration after
       * the chain has started. Attempting to do so will brick block production.
       **/
      epochDuration: u64 & AugmentedConst<ApiType>;
      /**
       * The expected average block time at which BABE should be creating
       * blocks. Since BABE is probabilistic it is not trivial to figure out
       * what the expected average block time should be based on the slot
       * duration and the security parameter `c` (where `1 - c` represents
       * the probability of a slot being empty).
       **/
      expectedBlockTime: Moment & AugmentedConst<ApiType>;
    };
    balances: {
      /**
       * The minimum amount required to keep an account open.
       **/
      existentialDeposit: Balance & AugmentedConst<ApiType>;
      /**
       * The maximum number of locks that should exist on an account.
       * Not strictly enforced, but used for weight estimation.
       **/
      maxLocks: u32 & AugmentedConst<ApiType>;
      /**
       * The maximum number of named reserves that can exist on an account.
       **/
      maxReserves: u32 & AugmentedConst<ApiType>;
    };
    bridgeTransfer: {
      bridgeTokenId: ResourceId & AugmentedConst<ApiType>;
      enableFee: bool & AugmentedConst<ApiType>;
    };
    chainBridge: {
      /**
       * The identifier for this chain.
       * This must be unique and must not collide with existing IDs within a set of bridged chains.
       **/
      bridgeChainId: BridgeChainId & AugmentedConst<ApiType>;
      proposalLifetime: BlockNumber & AugmentedConst<ApiType>;
    };
    democracy: {
      /**
       * Period in blocks where an external proposal may not be re-submitted after being vetoed.
       **/
      cooloffPeriod: BlockNumber & AugmentedConst<ApiType>;
      /**
       * The minimum period of locking and the period between a proposal being approved and enacted.
       * 
       * It should generally be a little more than the unstake period to ensure that
       * voting stakers have an opportunity to remove themselves from the system in the case where
       * they are on the losing side of a vote.
       **/
      enactmentPeriod: BlockNumber & AugmentedConst<ApiType>;
      /**
       * Minimum voting period allowed for a fast-track referendum.
       **/
      fastTrackVotingPeriod: BlockNumber & AugmentedConst<ApiType>;
      /**
       * Indicator for whether an emergency origin is even allowed to happen. Some chains may want
       * to set this permanently to `false`, others may want to condition it on things such as
       * an upgrade having happened recently.
       **/
      instantAllowed: bool & AugmentedConst<ApiType>;
      /**
       * How often (in blocks) new public referenda are launched.
       **/
      launchPeriod: BlockNumber & AugmentedConst<ApiType>;
      /**
       * The maximum number of public proposals that can exist at any time.
       **/
      maxProposals: u32 & AugmentedConst<ApiType>;
      /**
       * The maximum number of votes for an account.
       * 
       * Also used to compute weight, an overly big value can
       * lead to extrinsic with very big weight: see `delegate` for instance.
       **/
      maxVotes: u32 & AugmentedConst<ApiType>;
      /**
       * The minimum amount to be used as a deposit for a public referendum proposal.
       **/
      minimumDeposit: BalanceOf & AugmentedConst<ApiType>;
      /**
       * The amount of balance that must be deposited per byte of preimage stored.
       **/
      preimageByteDeposit: BalanceOf & AugmentedConst<ApiType>;
      /**
       * How often (in blocks) to check for new votes.
       **/
      votingPeriod: BlockNumber & AugmentedConst<ApiType>;
    };
    electionProviderMultiPhase: {
      /**
       * Maximum number of iteration of balancing that will be executed in the embedded miner of
       * the pallet.
       **/
      minerMaxIterations: u32 & AugmentedConst<ApiType>;
      /**
       * Maximum length (bytes) that the mined solution should consume.
       * 
       * The miner will ensure that the total length of the unsigned solution will not exceed
       * this value.
       **/
      minerMaxLength: u32 & AugmentedConst<ApiType>;
      /**
       * Maximum weight that the miner should consume.
       * 
       * The miner will ensure that the total weight of the unsigned solution will not exceed
       * this value, based on [`WeightInfo::submit_unsigned`].
       **/
      minerMaxWeight: Weight & AugmentedConst<ApiType>;
      /**
       * The priority of the unsigned transaction submitted in the unsigned-phase
       **/
      minerTxPriority: TransactionPriority & AugmentedConst<ApiType>;
      /**
       * The repeat threshold of the offchain worker.
       * 
       * For example, if it is 5, that means that at least 5 blocks will elapse between attempts
       * to submit the worker's solution.
       **/
      offchainRepeat: BlockNumber & AugmentedConst<ApiType>;
      /**
       * Base deposit for a signed solution.
       **/
      signedDepositBase: BalanceOf & AugmentedConst<ApiType>;
      /**
       * Per-byte deposit for a signed solution.
       **/
      signedDepositByte: BalanceOf & AugmentedConst<ApiType>;
      /**
       * Per-weight deposit for a signed solution.
       **/
      signedDepositWeight: BalanceOf & AugmentedConst<ApiType>;
      /**
       * Maximum number of signed submissions that can be queued.
       * 
       * It is best to avoid adjusting this during an election, as it impacts downstream data
       * structures. In particular, `SignedSubmissionIndices<T>` is bounded on this value. If you
       * update this value during an election, you _must_ ensure that
       * `SignedSubmissionIndices.len()` is less than or equal to the new value. Otherwise,
       * attempts to submit new solutions may cause a runtime panic.
       **/
      signedMaxSubmissions: u32 & AugmentedConst<ApiType>;
      /**
       * Maximum weight of a signed solution.
       * 
       * This should probably be similar to [`Config::MinerMaxWeight`].
       **/
      signedMaxWeight: Weight & AugmentedConst<ApiType>;
      /**
       * Duration of the signed phase.
       **/
      signedPhase: BlockNumber & AugmentedConst<ApiType>;
      /**
       * Base reward for a signed solution
       **/
      signedRewardBase: BalanceOf & AugmentedConst<ApiType>;
      /**
       * The minimum amount of improvement to the solution score that defines a solution as
       * "better" (in any phase).
       **/
      solutionImprovementThreshold: Perbill & AugmentedConst<ApiType>;
      /**
       * Duration of the unsigned phase.
       **/
      unsignedPhase: BlockNumber & AugmentedConst<ApiType>;
    };
    game: {
      maximumAttackCount: u32 & AugmentedConst<ApiType>;
      maximumAttackerNum: u32 & AugmentedConst<ApiType>;
      minimumAttackerNum: u32 & AugmentedConst<ApiType>;
    };
    imOnline: {
      /**
       * A configuration for base priority of unsigned transactions.
       * 
       * This is exposed so that it can be tuned for particular runtime, when
       * multiple pallets send unsigned transactions.
       **/
      unsignedPriority: TransactionPriority & AugmentedConst<ApiType>;
    };
    indices: {
      /**
       * The deposit needed for reserving an index.
       **/
      deposit: BalanceOf & AugmentedConst<ApiType>;
    };
    phragmenElection: {
      /**
       * How much should be locked up in order to submit one's candidacy.
       **/
      candidacyBond: BalanceOf & AugmentedConst<ApiType>;
      /**
       * Number of members to elect.
       **/
      desiredMembers: u32 & AugmentedConst<ApiType>;
      /**
       * Number of runners_up to keep.
       **/
      desiredRunnersUp: u32 & AugmentedConst<ApiType>;
      /**
       * Identifier for the elections-phragmen pallet's lock
       **/
      palletId: LockIdentifier & AugmentedConst<ApiType>;
      /**
       * How long each seat is kept. This defines the next block number at which an election
       * round will happen. If set to zero, no elections are ever triggered and the module will
       * be in passive mode.
       **/
      termDuration: BlockNumber & AugmentedConst<ApiType>;
      /**
       * Base deposit associated with voting.
       * 
       * This should be sensibly high to economically ensure the pallet cannot be attacked by
       * creating a gigantic number of votes.
       **/
      votingBondBase: BalanceOf & AugmentedConst<ApiType>;
      /**
       * The amount of bond that need to be locked for each vote (32 bytes).
       **/
      votingBondFactor: BalanceOf & AugmentedConst<ApiType>;
    };
    scheduler: {
      /**
       * The maximum weight that may be scheduled per block for any dispatchables of less priority
       * than `schedule::HARD_DEADLINE`.
       **/
      maximumWeight: Weight & AugmentedConst<ApiType>;
      /**
       * The maximum number of scheduled calls in the queue for a single block.
       * Not strictly enforced, but used for weight estimation.
       **/
      maxScheduledPerBlock: u32 & AugmentedConst<ApiType>;
    };
    staking: {
      /**
       * Number of eras that staked funds must remain bonded for.
       **/
      bondingDuration: EraIndex & AugmentedConst<ApiType>;
      maxNominations: u32 & AugmentedConst<ApiType>;
      /**
       * The maximum number of nominators rewarded for each validator.
       * 
       * For each validator only the `$MaxNominatorRewardedPerValidator` biggest stakers can claim
       * their reward. This used to limit the i/o cost for the nominator payout.
       **/
      maxNominatorRewardedPerValidator: u32 & AugmentedConst<ApiType>;
      /**
       * Number of sessions per era.
       **/
      sessionsPerEra: SessionIndex & AugmentedConst<ApiType>;
      /**
       * Number of eras that slashes are deferred by, after computation.
       * 
       * This should be less than the bonding duration. Set to 0 if slashes
       * should be applied immediately, without opportunity for intervention.
       **/
      slashDeferDuration: EraIndex & AugmentedConst<ApiType>;
    };
    system: {
      /**
       * Maximum number of block number to block hash mappings to keep (oldest pruned first).
       **/
      blockHashCount: BlockNumber & AugmentedConst<ApiType>;
      /**
       * The maximum length of a block (in bytes).
       **/
      blockLength: BlockLength & AugmentedConst<ApiType>;
      /**
       * Block & extrinsics weights: base values and limits.
       **/
      blockWeights: BlockWeights & AugmentedConst<ApiType>;
      /**
       * The weight of runtime database operations the runtime can invoke.
       **/
      dbWeight: RuntimeDbWeight & AugmentedConst<ApiType>;
      /**
       * The designated SS85 prefix of this chain.
       * 
       * This replaces the "ss58Format" property declared in the chain spec. Reason is
       * that the runtime should know about the prefix in order to make use of it as
       * an identifier of the chain.
       **/
      ss58Prefix: u16 & AugmentedConst<ApiType>;
      /**
       * Get the chain's current version.
       **/
      version: RuntimeVersion & AugmentedConst<ApiType>;
    };
    timestamp: {
      /**
       * The minimum period between blocks. Beware that this is different to the *expected* period
       * that the block production apparatus provides. Your chosen consensus system will generally
       * work with this to determine a sensible block time. e.g. For Aura, it will be double this
       * period on default settings.
       **/
      minimumPeriod: Moment & AugmentedConst<ApiType>;
    };
    transactionPayment: {
      /**
       * The fee to be paid for making a transaction; the per-byte portion.
       **/
      transactionByteFee: BalanceOf & AugmentedConst<ApiType>;
      /**
       * The polynomial that is applied in order to derive fee from weight.
       **/
      weightToFee: Vec<WeightToFeeCoefficient> & AugmentedConst<ApiType>;
    };
    treasury: {
      /**
       * Percentage of spare funds (if any) that are burnt per spend period.
       **/
      burn: Permill & AugmentedConst<ApiType>;
      /**
       * The maximum number of approvals that can wait in the spending queue.
       **/
      maxApprovals: u32 & AugmentedConst<ApiType>;
      /**
       * The treasury's pallet id, used for deriving its sovereign account ID.
       **/
      palletId: PalletId & AugmentedConst<ApiType>;
      /**
       * Fraction of a proposal's value that should be bonded in order to place the proposal.
       * An accepted proposal gets these back. A rejected proposal does not.
       **/
      proposalBond: Permill & AugmentedConst<ApiType>;
      /**
       * Minimum amount of funds that should be placed in a deposit for making a proposal.
       **/
      proposalBondMinimum: BalanceOf & AugmentedConst<ApiType>;
      /**
       * Period between successive spends.
       **/
      spendPeriod: BlockNumber & AugmentedConst<ApiType>;
    };
    utility: {
      /**
       * The limit on the number of batched calls.
       **/
      batchedCallsLimit: u32 & AugmentedConst<ApiType>;
    };
    vesting: {
      /**
       * The minimum amount transferred to call `vested_transfer`.
       **/
      minVestedTransfer: BalanceOf & AugmentedConst<ApiType>;
    };
  } // AugmentedConsts
} // declare module
