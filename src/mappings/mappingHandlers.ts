import {SubstrateExtrinsic} from "@subql/types";
import {Proposal, Project, CrossChainAccount, Protocol, VotingFormat, Workspace, Strategy} from "../types";
import { ProjectId, ProposalId, DAOProposal, Project as DAOProject, UserGroup, CrossChainAccount as DAOCrossChainAccount, VoteUpdate, Workspace as DAOWorkspace, Strategy as DAOStrategy } from "../interfaces/daoPortal/types"
import fetch from "cross-fetch";
import type { Vec, Option, U256 } from '@polkadot/types';

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

    const {extrinsic: {method: {args: [, proposal]}}} = extrinsic;

    const daoProposal = proposal as DAOProposal;
    logger.info(`(${extrinsic.block.block.header.number.toNumber()}) Create Proposal (project: ${projectId}, id: ${proposalId}):\n ${daoProposal}`);

    /// populating record
    /// id
    let record = new Proposal(`${projectId}-${proposalId}`);
    
    /// project
    record.projectId = projectId.toString();
    
    /// proposal
    record.proposal = proposalId.toNumber();

    /// start
    record.start = daoProposal._start.toBigInt();

    /// end
    record.end = daoProposal._end.toBigInt();

    /// author
    await ensureCrossChainAccount(daoProposal._author);
    record.authorId = daoProposal._author.inner.toString();

    /// privacy
    switch(daoProposal._privacy.type) {
        case 'Opaque': {
            record.privacy = {
                opaque: daoProposal._privacy.asOpaque.toNumber()
            }
            break;
        }
        case 'Rank': {
            record.privacy = {
                rank: ''
            }
            break;
        }
        case 'Private': {
            record.privacy = {
                private: ''
            }
            break;
        }
        case 'Public': {
            record.privacy = {
                public: ''
            }
            break;
        }
        case 'Mixed': {
            record.privacy = {
                mixed: ''
            }
            break;
        }
        default: {
            record.privacy = {}
            break;
        }
    }

    /// format
    record.format = daoProposal._voting_format.type as VotingFormat;

    /// optioncount
    record.optioncount = daoProposal._option_count.toNumber();

    /// frequency
    if (daoProposal._frequency.isSome) {
        record.frequency = daoProposal._frequency.unwrap().toBigInt();
    }

    /// finalized
    record.finalized = false;

    /// votes
    record.votes = [];
    for (let i = 0; i < record.optioncount; i++) {
        record.votes.push('0');
    }

    /// pubvote
    /// skip
    
    /// blacklisted
    record.blacklisted = false;

    /// created
    record.created = extrinsic.block.block.header.number.toNumber();

    /// updated
    record.updated = extrinsic.block.block.header.number.toNumber();

    /// updates
    record.updates = 0;

    /// data
    const data = daoProposal._data.toString();
    record.data = data;

    /// title
    /// description
    /// options
    await updateProposalIpfs(record).then(async (response) => {
        record = response;
    }).catch((e) => {
        logger.error(`updateProposalIpfs error: ${e}`);
    })

    /// workspaces
    const proj_record = await Project.get(`${projectId}`);
    record.workspaces = proj_record.workspaces;
    
    /// snapshots
    /// skip

    logger.info(`proposal: ${daoProposal}`)

    await record.save();

    // update project
    // const proj_record = await Project.get(`${projectId}`);
    proj_record.prop_count++;
    proj_record.prop_updated = extrinsic.block.block.header.number.toNumber();

    await proj_record.save();
}

function populateStrategy(strategies: Vec<DAOStrategy>): Strategy[] {
    let ret = [];

    for (let i = 0; i < strategies.length; i++) {
        const strategy = strategies.at(i);

        let j_stg: Strategy = {
            protocol: strategy.type,
        }

        if (strategy.isSolidity) {
            j_stg.solidity = strategy.asSolidity.type;
        } else if (strategy.isSubstrate) {
            j_stg.substrate = strategy.asSubstrate.type;
        } else {
            // shouldn't happen
        }

        if (!strategy.isEmpty) {
            j_stg.param = strategy.toHex();
        }        

        ret.push(j_stg)
    }

    return ret;
}

function populateWorkspace(record: Project, workspaces: Vec<DAOWorkspace>): Project  {
    record.workspaces = [];

    for (let i = 0; i < workspaces.length; i++) {
        const workspace = workspaces.at(i);
        const chainId = workspace._chain.toNumber();

        let j_workspace: Workspace = {
            chain: chainId,
            strategies: populateStrategy(workspace.strategies)
        }
        
        record.workspaces.push(j_workspace);
    }

    return record;
}

async function constructUserGroup(record: Project, usergroup: UserGroup): Promise<Project> {
    record.enable_proposer = usergroup.proposers.isSome;

    return record;
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

    const {extrinsic: {method: {args: [project]}}} = extrinsic;
    const daoProject = project as DAOProject;

    logger.info(`(${extrinsic.block.block.header.number.toNumber()}) Create Project (id: ${projectId}):\n ${daoProject}`);

    let record = new Project(`${projectId}`);

    /// populating record
    /// owner
    await ensureCrossChainAccount(daoProject.usergroup.owner);
    record.ownerId = daoProject.usergroup.owner.inner.toString();

    /// updated
    record.updated = extrinsic.block.block.header.number.toNumber();
    
    /// prop_count
    record.prop_count = 0;

    /// prop_updated
    record.prop_updated = extrinsic.block.block.header.number.toNumber();

    /// workspaces
    record = populateWorkspace(record, daoProject.workspaces);

    /// enable_proposer
    await constructUserGroup(record, daoProject.usergroup).then(async (response) => {
        record = response
    }).catch((e) => {
        logger.error(`constructUserGroup error: ${e}`);
    })

    /// data
    const data = daoProject.data.toString();
    record.data = data;

    /// name
    /// description
    /// icon
    /// banner
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
    
    await ensureCrossChainAccount(daoProject.usergroup.owner);
    record.ownerId = daoProject.usergroup.owner.inner.toString();
    const data = daoProject.data.toString();
    record.data = data;
    record.updated = extrinsic.block.block.header.number.toNumber();

    record = populateWorkspace(record, daoProject.workspaces);

    await updateProjectIpfs(record).then(async (response) => {
        record = response;
    }).catch((e) => {
        logger.error(`updateProjectIpfs error: ${e}`);
    })

    await record.save();

    // const ws_records = await Workspace.getByProjectId(projectId.toString());
    // for (let i = 0; i < ws_records.length; i++) {
    //     const wid = ws_records.at(i).id;
    //     const stg_records = await Strategy.getByWorkspaceId(wid);
    //     for (let j = 0; j < stg_records.length; j++) {
    //         const sid = stg_records.at(j).id;
    //         await Strategy.remove(sid);
    //     }
    //     await Workspace.remove(wid);
    // }

    // await populateWorkspace(daoProject.workspaces, projectId);
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

    record.updated = extrinsic.block.block.header.number.toNumber();

    record.updates = record.updates + 1;

    await record.save();
}

export async function handleUpdateSnapshots(extrinsic: SubstrateExtrinsic): Promise<void> {
    const {extrinsic: {method: {args: [project_id, proposal_id, snapshots]}}} = extrinsic;

    const projectId = project_id as ProjectId;
    const proposalId = proposal_id as ProposalId;
    const vec_snapshots = snapshots as Vec<Option<U256>>;

    logger.info(`(${extrinsic.block.block.header.number.toNumber()}) Update Snapshots (project: ${projectId}, proposal: ${proposalId}):\n ${vec_snapshots}`);

    const record = await Proposal.get(`${projectId}-${proposalId}`);

    record.snapshots = [];

    for (const snapshot of vec_snapshots) {
        // record.votes.push(power.toHex());
        if (snapshot.isNone) {
            record.snapshots.push('');
        } else {
            record.snapshots.push(snapshot.toHex());
        }
    }

    // const timestamp = extrinsic.block.timestamp;

    record.updated = extrinsic.block.block.header.number.toNumber();

    await record.save();
}