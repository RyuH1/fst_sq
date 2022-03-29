import {SubstrateExtrinsic} from "@subql/types";
import {Proposal, Project, CrossChainAccount, Protocol, Privacy, ProposalStatus, VotingFormat, Workspace, Strategy, SolidityStrategy, SubstrateStrategy} from "../types";
import { ProjectId, ProposalId, DAOProposal, Project as DAOProject, CrossChainAccount as DAOCrossChainAccount, VoteUpdate, Workspace as DAOWorkspace } from "../interfaces/daoPortal/types"
import fetch from "cross-fetch";
import type { Vec } from '@polkadot/types';

const IPFS_PIN_URL = "https://anydao.mypinata.cloud/ipfs";

type ProposalData = {
    _title: string
    _description: string
    _options: string[]
  }

type ProjectData = {
    name: string
    description: string
    icon: string
    banner: string
}

async function ensureCrossChainAccount(account: DAOCrossChainAccount): Promise<void> {
    const record = await CrossChainAccount.get(account.inner.toString());
    if (!record) {
        let record = new CrossChainAccount(account.inner.toString());

        record.protocol = account.type as Protocol;

        await record.save();
    }
}

async function updateProposalIpfs(record: Proposal): Promise<Proposal> {
    if (record.data !== "") {
        fetch(`${IPFS_PIN_URL}/${record.data}`)
            .then(async (response) => {
                try {
                    let pdata = (await response.json()) as ProposalData;

                    logger.info(`details: ${pdata._title}\n${pdata._description}\n${pdata._options}`);

                    record.title = pdata._title;
                    record.description = pdata._description;
                    record.options = pdata._options;
                } catch (e) {
                    throw e
                }
            })
            .catch((e) => {
                return Promise.reject(e)
            })
    }
    return record;
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
    logger.info(`(${extrinsic.block.block.header.number.toNumber()}) Create Proposal (project: ${projectId}, id: ${proposalId}):\n ${daoProposal}`);

    /// populating record
    record.start = daoProposal._start.toBigInt();
    record.end = daoProposal._end.toBigInt();

    await ensureCrossChainAccount(daoProposal._author);
    record.authorId = daoProposal._author.inner.toString();

    record.privacy = daoProposal._privacy.type as Privacy;

    record.format = daoProposal._voting_format.type as VotingFormat;

    record.optioncount = daoProposal._option_count.toNumber();

    if (daoProposal._frequency.isSome) {
        record.frequency = daoProposal._frequency.unwrap().toBigInt();
    }

    record.status = daoProposal.state.status.type as ProposalStatus;

    record.votes = [];

    for (const vote of daoProposal.state.votes) {
        record.votes.push(vote.toHex());
    }

    if (daoProposal.state.pub_voters.isSome) {
        record.pubvote = daoProposal.state.pub_voters.unwrapOrDefault().toString();
    }

    logger.info(`proposal: ${daoProposal}`)

    const data = daoProposal._data.toString();

    record.data = data;

    await updateProposalIpfs(record).then(async (response) => {
        record = response;
    }).catch((e) => {
        logger.error(`updateProposalIpfs error: ${e}`);
    })

    record.created = extrinsic.block.block.header.number.toNumber();
    record.updated = extrinsic.block.block.header.number.toNumber();

    await record.save();

    // update project
    const proj_record = await Project.get(`${projectId}`);
    proj_record.prop_count++;
    await proj_record.save();
}

async function populateWorkspace(workspaces: Vec<DAOWorkspace>, projectId: ProjectId): Promise<string[]>  {
    let workspaceIds = [];

    for (let i = 0; i < workspaces.length; i++) {
        const workspace = workspaces.at(i);
        let ws_record = new Workspace(`${projectId}-${i}`);
        ws_record.chain = workspace._chain.toNumber();
        let strategies = [];
        for (let j = 0; j < workspace.strategies.length; j++) {
            const strategy = workspace.strategies.at(j);
            let stg_record = new Strategy(`${projectId}-${i}-${j}`);
            stg_record.protocol = strategy.type as Protocol;
            if (stg_record.protocol == Protocol.Solidity) {
                stg_record.solidity = strategy.asSolidity.type as SolidityStrategy;
                if (!strategy.asSolidity.inner.isEmpty) {
                    stg_record.param = strategy.asSolidity.inner.toHex();
                }
            } else if (stg_record.protocol == Protocol.Substrate) {
                stg_record.substrate = strategy.asSolidity.type as SubstrateStrategy;
                if (!strategy.asSubstrate.inner.isEmpty) {
                    stg_record.param = strategy.asSubstrate.inner.toHex();
                }
            } else {
                // Shouldn't happen
            }
            await stg_record.save();
            strategies.push(stg_record.id);
        }
        ws_record.strategiesId = strategies;
        
        await ws_record.save();
        workspaceIds.push(ws_record.id);
    }

    return workspaceIds;
}

async function updateProjectIpfs(record: Project): Promise<Project> {
    if (record.data !== "") {
        fetch(`${IPFS_PIN_URL}/${record.data}`)
            .then(async (response) => {
                try {
                    let pdata = (await response.json()) as ProjectData;

                    logger.info(`details: ${pdata.name}\n${pdata.description}\n${pdata.icon}\n${pdata.banner}`);

                    record.name = pdata.name;
                    record.description = pdata.description;
                    record.icon = pdata.icon;
                    record.banner = pdata.banner;
                } catch (e) {
                    throw e
                }
            })
            .catch((e) => {
                return Promise.reject(e)
            })
    }
    return record;
}

export async function handleAddProject(extrinsic: SubstrateExtrinsic): Promise<void> {
    const addEvent = extrinsic.events.find(e => e.event.section === 'daoPortal' && e.event.method === 'ProjectCreated');
    const {event: {data: [project_id]}} = addEvent;
    const projectId = project_id as ProjectId;

    let record = new Project(`${projectId}`);

    const {extrinsic: {method: {args: [project]}}} = extrinsic;
    const daoProject = project as DAOProject;

    logger.info(`(${extrinsic.block.block.header.number.toNumber()}) Create Project (id: ${projectId}):\n ${daoProject}`);
    
    await ensureCrossChainAccount(daoProject.owner);
    record.ownerId = daoProject.owner.inner.toString();
    const data = daoProject.data.toString();
    record.data = data;
    record.updated = extrinsic.block.block.header.number.toNumber();
    record.prop_count = 0;

    record.workspacesId = await populateWorkspace(daoProject.workspaces, projectId);

    await updateProjectIpfs(record).then(async (response) => {
        record = response;
    }).catch((e) => {
        logger.error(`updateProjectIpfs error: ${e}`);
    })

    await record.save();
}

export async function handleUpdateProject(extrinsic: SubstrateExtrinsic): Promise<void> {
    const {extrinsic: {method: {args: [project_id, project]}}} = extrinsic;
    
    const projectId = project_id as ProjectId;
    let record = await Project.get(`${projectId}`);
    
    const daoProject = project as DAOProject;

    logger.info(`(${extrinsic.block.block.header.number.toNumber()}) Update Project (id: ${projectId}):\n ${daoProject}`);
    
    await ensureCrossChainAccount(daoProject.owner);
    record.ownerId = daoProject.owner.inner.toString();
    const data = daoProject.data.toString();
    record.data = data;
    record.updated = extrinsic.block.block.header.number.toNumber();

    for (let i = 0; i < record.workspacesId.length; i++) {
        const wid = record.workspacesId.at(i);
        const ws_record = await Workspace.get(`${wid}`);
        for (let j = 0; j < ws_record.strategiesId.length; j++) {
            const sid = ws_record.strategiesId.at(j);
            await Strategy.remove(`${sid}`);
        }
        await Workspace.remove(`${wid}`);
    }
    record.workspacesId = await populateWorkspace(daoProject.workspaces, projectId);

    await updateProjectIpfs(record).then(async (response) => {
        record = response;
    }).catch((e) => {
        logger.error(`updateProjectIpfs error: ${e}`);
    })

    await record.save();
}

export async function handleUpdateVote(extrinsic: SubstrateExtrinsic): Promise<void> {
    const {extrinsic: {method: {args: [update]}}} = extrinsic;

    const vote = update as VoteUpdate;

    logger.info(`(${extrinsic.block.block.header.number.toNumber()}) Update Vote (project: ${vote.project}, proposal: ${vote.proposal}):\n ${vote}`);

    const record = await Proposal.get(`${vote.project}-${vote.proposal}`);

    record.votes = [];

    for (const power of vote.votes) {
        record.votes.push(power.toHex());
    }

    if (vote.pub_voters.isSome) {
        record.pubvote = vote.pub_voters.unwrapOrDefault().toString();
    }

    const timestamp = extrinsic.block.timestamp;

    if (timestamp.getTime() >= record.end) {
        record.status = ProposalStatus.Closed;
    } else {
        record.status = ProposalStatus.Ongoing;
    }

    record.updated = extrinsic.block.block.header.number.toNumber();

    await record.save();
}