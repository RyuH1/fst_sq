import type { OverrideBundleDefinition } from '@polkadot/types/types';

// structs need to be in order
/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: {
        ResourceId: '[u8; 32]',
        DepositNonce: 'u64',
        ProposalStatus: {
          _enum: [
            'Initiated',
            'Approved',
            'Rejected'
          ]
        },
        ProposalVotes: {
          votes_for: 'Vec<AccountId>',
          votes_against: 'Vec<AccountId>',
          status: 'ProposalStatus'
        },
        BridgeTokenId: 'U256',
        BridgeChainId: 'u8',
        ProposalId: 'u32',
        ProjectId: 'u32',
        ChainIndex: 'u32',
        Protocol: {
          _enum: [
            'Solidity',
            'Substrate'
          ]
        },
        Chain: {
          _protocol: 'Protocol'
        },
        CrossChainAccount: {
          _enum: {
            Solidity: 'H160',
            Substrate: 'AccountId'
          }
        },
        IpfsHash: 'Text',
        SolidityStrategy: {
          _enum: {
            ERC20Balance: 'H160'
          }
        },
        SubstrateStrategy: {
          _enum: [
            'NativeBalance'
          ]
        },
        Strategy: {
          _enum: {
            Solidity: 'SolidityStrategy',
            Substrate: 'SubstrateStrategy'
          }
        },
        Workspace: {
          _chain: 'ChainIndex',
          strategies: 'Vec<Strategy>'
        },
        Project: {
          owner: 'CrossChainAccount',
          data: 'IpfsHash',
          workspaces: 'Vec<Workspace>'
        },
        VotingFormat: {
          _enum: [
            'SingleChoice'
          ]
        },
        OptionIndex: 'u8',
        PrivacyLevel: {
          _enum: [
            'Opaque',
            'Private',
            'Public',
            'Mixed'
          ]
        },
        VotingPower: 'U256',
        DAOProposalStatus: {
          _enum: [
            'Pending',
            'Ongoing',
            'Closed'
          ]
        },
        DAOProposalState: {
          status: 'DAOProposalStatus',
          votes: 'Vec<VotingPower>',
          pub_voters: 'Option<IpfsHash>',
          updates: 'u32'
        },
        DAOProposal: {
          _author: 'CrossChainAccount',
          _voting_format: 'VotingFormat',
          _option_count: 'OptionIndex',
          _data: 'IpfsHash',
          _privacy: 'PrivacyLevel',
          _start: 'u64',
          _end: 'u64',
          _frequency: 'Option<u64>',
          state: 'DAOProposalState'
        },
        VoteUpdate: {
          project: 'ProjectId',
          proposal: 'ProposalId',
          votes: 'Vec<VotingPower>',
          pub_voters: 'Option<IpfsHash>'
        }
      }
    }
  ]
};

export default { typesBundle: { spec: { finitestate: definitions }}};
