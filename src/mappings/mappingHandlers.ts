import {SubstrateExtrinsic} from "@subql/types";
import {Proposal, Project, CrossChainAccount, Protocol, Privacy, ProposalStatus} from "../types";
import { ProjectId, ProposalId, DAOProposal, Project as DAOProject, CrossChainAccount as DAOCrossChainAccount } from "../interfaces/daoPortal/types"

async function ensureCrossChainAccount(account: DAOCrossChainAccount): Promise<void> {
    const record = await CrossChainAccount.get(account.inner.toString());
    if (!record) {
        let record = new CrossChainAccount(account.inner.toString());

        record.protocol = account.type as Protocol;

        await record.save();
    }
}

export async function handleAddProposal(extrinsic: SubstrateExtrinsic): Promise<void> {
    const addEvent = extrinsic.events.find(e => e.event.section === 'daoPortal' && e.event.method === 'ProposalCreated');
    const {event: {data: [project_id, proposal_id]}} = addEvent;
    const projectId = project_id as ProjectId;
    const proposalId = proposal_id as ProposalId;

    let record = new Proposal(`${projectId}-${proposalId}`);

    record.projectId = projectId.toString();
    record.proposal = proposalId.toNumber();

    const {extrinsic: {method: {args: [, proposal]}}} = extrinsic;

    const daoProposal = proposal as DAOProposal;
    logger.info(`Create Proposal (project: ${projectId}, id: ${proposalId}):\n ${daoProposal}`);

    /// populating record
    record.start = daoProposal._start.toBigInt();
    record.end = daoProposal._end.toBigInt();

    await ensureCrossChainAccount(daoProposal._author);
    record.authorId = daoProposal._author.inner.toString();

    record.privacy = daoProposal._privacy.type as Privacy;

    if (daoProposal._frequency.isSome) {
        record.frequency = daoProposal._frequency.unwrap().toBigInt();
    }

    record.status = daoProposal.state.status.type as ProposalStatus;

    record.votes = [];

    for (const vote of daoProposal.state.votes) {
        record.votes.push(vote.toBigInt());
    }

    if (daoProposal.state.pub_voters.isSome) {
        record.pubvote = daoProposal.state.pub_voters.unwrap().toString();
    }

    record.data = daoProposal._data.toString();

    record.created = extrinsic.block.block.header.number.toNumber();

    await record.save();
}

export async function handleAddProject(extrinsic: SubstrateExtrinsic): Promise<void> {
    const addEvent = extrinsic.events.find(e => e.event.section === 'daoPortal' && e.event.method === 'ProjectCreated');
    const {event: {data: [project_id]}} = addEvent;
    const projectId = project_id as ProjectId;

    let record = new Project(`${projectId}`);

    const {extrinsic: {method: {args: [project]}}} = extrinsic;
    const daoProject = project as DAOProject;

    logger.info(`Create Project (id: ${projectId}):\n ${daoProject}`);
    
    await ensureCrossChainAccount(daoProject.owner);
    record.ownerId = daoProject.owner.inner.toString();
    record.data = daoProject.data.toString();
    record.updated = extrinsic.block.block.header.number.toNumber();

    await record.save();
}

export async function handleUpdateProject(extrinsic: SubstrateExtrinsic): Promise<void> {
    const {extrinsic: {method: {args: [project_id, project]}}} = extrinsic;
    
    const projectId = project_id as ProjectId;
    const record = await Project.get(`${projectId}`);
    
    const daoProject = project as DAOProject;

    logger.info(`Update Project (id: ${projectId}):\n ${daoProject}`);
    
    await ensureCrossChainAccount(daoProject.owner);
    record.ownerId = daoProject.owner.inner.toString();
    record.data = daoProject.data.toString();
    record.updated = extrinsic.block.block.header.number.toNumber();

    await record.save();
}