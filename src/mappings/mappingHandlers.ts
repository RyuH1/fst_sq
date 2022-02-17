import {SubstrateExtrinsic,SubstrateEvent,SubstrateBlock} from "@subql/types";
import {Proposal} from "../types";
// import {StarterEntity} from "../types";
import { ProjectId, ProposalId, DAOProposal } from "../interfaces/daoportal/types"

export async function handleBlock(block: SubstrateBlock): Promise<void> {
    // //Create a new starterEntity with ID using block hash
    // let record = new StarterEntity(block.block.header.hash.toString());
    // //Record block number
    // record.field1 = block.block.header.number.toNumber();
    // await record.save();
    logger.into(`new block: ${block.block.header.hash.toString()}`)
}

export async function handleProposalCreated(event: SubstrateEvent): Promise<void> {
    const {event: {data: [project_id, proposal_id]}} = event;
    const projectId = project_id as ProjectId;
    const proposalId = proposal_id as ProposalId;

    //Retrieve the record by its ID
    let record = new Proposal(`${projectId.toNumber()}-${proposalId.toNumber()}`);
    record.project = projectId.toNumber();

    logger.info(`Proposal: ${projectId.toNumber()}-${proposalId.toNumber()}`)
    // console.log(`Proposal: ${projectId.toNumber()}-${proposalId.toNumber()}`);

    // record.field2 = account.toString();
    // //Big integer type Balance of a transfer event
    // record.field3 = (balance as Balance).toBigInt();
    await record.save();
}

// export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void> {
//     const record = await StarterEntity.get(extrinsic.block.block.header.hash.toString());
//     logger.into(`timestamp: ${extrinsic.block.timestamp}`)
//     //Date type timestamp
//     record.field4 = extrinsic.block.timestamp;
//     //Boolean tyep
//     record.field5 = true;
//     await record.save();
// }

export async function handleProposal(extrinsic: SubstrateExtrinsic): Promise<void> {
    const addEvent = extrinsic.events.find(e => e.event.section === 'daoPortal' && e.event.method === 'ProposalCreated');
    const {event: {data: [project_id, proposal_id]}} = addEvent;
    const projectId = project_id as ProjectId;
    const proposalId = proposal_id as ProposalId;

    let record = new Proposal(`${projectId}-${proposalId}`);
    
    record.project = projectId.toNumber();
    record.proposal = proposalId.toNumber();

    const {extrinsic: {method: {args: [, proposal]}}} = extrinsic;

    const daoProposal = proposal as DAOProposal;
    logger.info(`Proposal: ${daoProposal}`);
    record.start = daoProposal._start.toBigInt();
    record.end = daoProposal._end.toBigInt();

    await record.save();
}


