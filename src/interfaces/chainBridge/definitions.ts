export default {
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
    }
  }