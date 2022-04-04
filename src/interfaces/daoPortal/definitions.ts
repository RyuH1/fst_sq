export default {
    types: {
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
          ERC20Balance: 'H160'
        }
      },
      SubstrateStrategy: {
        _enum: ['NativeBalance']
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
      }
    }
  }