import type { OverrideBundleDefinition } from '@polkadot/types/types';

// structs need to be in order
/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: {
        DispatchErrorModule: {
          index: "u8",
          error: "u8"
        },
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
        VestingPlan: {
          start_time: 'u64',
          cliff_duration: 'u64',
          total_duration: 'u64',
          interval: 'u64',
          initial_amount: 'Balance',
          total_amount: 'Balance',
          vesting_during_cliff: 'bool'
        },
        ProposalId: 'u32',
        ProjectId: 'u32',
        ChainIndex: 'u32',
        Protocol: {
          _enum: ['Solidity', 'Substrate']
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
            ERC20Balance: 'H160',
            Custom: '(IpfsHash, Vec<u8>)'
          }
        },
        SubstrateStrategy: {
          _enum: {
            NativeBalance: 'Null',
            Custom: '(IpfsHash, Vec<u8>)'
          }
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
        UserGroup: {
          owner: "CrossChainAccount",
          admins: "Vec<CrossChainAccount>",
          maintainers: "Vec<CrossChainAccount>",
          proposers: "Option<Vec<CrossChainAccount>>"
        },
        Project: {
          usergroup: "UserGroup",
          data: 'IpfsHash',
          workspaces: 'Vec<Workspace>'
        },
        VotingFormat: {
          _enum: ['SingleChoice', 'SplitVote']
        },
        OptionIndex: 'u8',
        PrivacyLevel: {
          _enum: {
            Opaque: 'u8',
            Rank: 'Null',
            Private: 'Null',
            Public: 'Null',
            Mixed: 'Null'
          }
        },
        VotingPower: 'U256',
        DAOProposalState: {
          finalized: "bool",
          snapshots: "Vec<U256>",
          blacklisted: "bool",
          votes: "Vec<VotingPower>",
          pub_voters: "Option<IpfsHash>",
          updates: "u32"
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
        },
        GmetadataNamespaceName: 'Text',
        GmetadataNamespaceInfo: {
          id: 'u32',
          name: 'Vec<u8>',
          owners: 'Vec<AccountId>'
        },
        GmetadataValueInfo: {
          data: 'Vec<u8>',
          update_time: 'u64'
        },
        GmetadataIndexInfo: {
          data: 'Vec<Vec<u8>>',
          update_time: 'u64'
        },
        GmetadataKey: {
          ns: 'u32',
          table: 'Vec<u8>',
          pk: 'Vec<u8>'
        },
        GmetadataWriteOp: {
          _enum: {
            SetValue: '(GmetadataKey, Vec<u8>)',
            RemoveValue: 'GmetadataKey',
            AddIndex: '(GmetadataKey, Vec<u8>)',
            RemoveIndex: '(GmetadataKey, Vec<u8>)'
          }
        },
        AttestorOf: {
          id: "Vec<u8>",
          pubkey: "Vec<u8>",
          application: "BTreeSet<AccountId>"
        },
        GeodeOf: {
          id: "AccountId",
          provider: "AccountId",
          ip: "Vec<u8>",
          domain: "Vec<u8>",
          props: "BTreeMap<Vec<u8>, Vec<u8>>",
          healthy_state: "HealthyState",
          working_state: "WorkingState<BlockNumber>",
          order_id: "Option<Hash>"
        },
        WorkingState: {
          _enum: {
            Idle: "()",
            Pending: "BlockNumber",
            Working: "BlockNumber",
            Finalizing: "BlockNumber",
            Exiting: "()",
            Exited: "BlockNumber"
          }
        },
        HealthyState: {
          _enum: {
            Unhealthy: "()",
            Healthy: "()"
          }
        },
        OrderOf: {
          order_id: "Hash",
          binary: "Vec<u8>",
          encrypted: "bool",
          domain: "Vec<u8>",
          name: "Vec<u8>",
          price: "U256",
          start_session_id: "u32",
          duration: "u32",
          geode_num: "u32",
          state: "OrderState",
          refund_unit: "u32",
          service_owner: "[u8; 32]"
        },
        OrderState: {
          _enum: {
            Submitted: "()",
            Pending: "()",
            Processing: "()",
            Emergency: "()",
            Done: "()"
          }
        },
      }
    }
  ]
};

export default { typesBundle: { spec: { finitestate: definitions } } };
