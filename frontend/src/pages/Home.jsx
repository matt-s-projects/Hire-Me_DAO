import React from 'react'
import { useState, useEffect } from 'react';
import { LinkTo, Tag, Table, Form } from "web3uikit"
import { Link } from "react-router-dom";
import { useMoralis, useMoralisWeb3Api, useWeb3ExecuteFunction } from "react-moralis"

const Home = () => {
    const [passRate, setPassRate] = useState(0);
    const [totalP, setTotalP] = useState(0);
    const [counted, setCounted] = useState(0);
    const [voters, setVoters] = useState(0);
    const { Moralis, isInitialized } = useMoralis();
    const [polls, setPolls] = useState();
    const Web3Api = useMoralisWeb3Api();
    const [sub, setSub] = useState();
    const contractProcessor = useWeb3ExecuteFunction();

    async function createPoll(newPoll) {
        let options = {
            contractAddress: "0x28F9Ad2239fD3acC0431223C5660aE8F779B5061",
            functionName: "createPoll",
            abi: [
                {
                    inputs: [
                        {
                            internalType: "string",
                            name: "_description",
                            type: "string",
                        },
                        {
                            internalType: "address[]",
                            name: "_voters",
                            type: "address[]",
                        },
                    ],
                    name: "createPoll",
                    outputs: [],
                    stateMutability: "nonpayable",
                    type: "function",
                },
            ],
            params: {
                _description: newPoll,
                _voters: voters,
            },
        };
        await contractProcessor.fetch({
            params: options,
            onSuccess: () => {
                setSub(false);
            },
            onError: (error) => {
                alert(error.data.message);
                setSub(false);
            },
        });


    }

    async function getStatus(pollId) {
        const PollCounts = Moralis.Object.extend("Counted");
        const query = new Moralis.Query(PollCounts);
        query.equalTo("uid", pollId);
        const result = await query.first();
        if (result !== undefined) {
            if (result.attributes.passed) {
                return { color: "green", text: "Passed" };
            } else {
                return { color: "red", text: "Rejected" };
            }
        } else {
            return { color: "blue", text: "Ongoing" };
        }

    }

    useEffect(() => {
        if (isInitialized) {

            async function getPolls() {
                const Polls = Moralis.Object.extend("Polls");
                const query = new Moralis.Query(Polls);
                query.descending("uid_decimal");
                const results = await query.find();
                const table = await Promise.all(
                    results.map(async (e) => [
                        e.attributes.uid,
                        e.attributes.description,
                        <Link to="/poll" state={{
                            description: e.attributes.description,
                            color: (await getStatus(e.attributes.uid)).color,
                            text: (await getStatus(e.attributes.uid)).text,
                            id: e.attributes.uid,
                            proposer: e.attributes.proposer

                        }}>
                            <Tag
                                color={(await getStatus(e.attributes.uid)).color}
                                text={(await getStatus(e.attributes.uid)).text}
                            />
                        </Link>,
                    ])
                );
                setPolls(table);
                setTotalP(results.length);
            }


            async function getPassRate() {
                const PollCounts = Moralis.Object.extend("Counted");
                const query = new Moralis.Query(PollCounts);
                const results = await query.find();
                let votesFor = 0;

                results.forEach((e) => {
                    if (e.attributes.passed) {
                        votesFor++;
                    }
                });

                setCounted(results.length);
                setPassRate((votesFor / results.length) * 100);
            }


            const fetchTokenIdOwners = async () => {
                const options = {
                    address: "0x2953399124F0cBB46d2CbACD8A89cF0599974963",
                    token_id:
                        "71876655463953535015688948417827604262466894376888337717173686517707277598730",
                    chain: "mumbai",
                };
                const tokenIdOwners = await Web3Api.token.getTokenIdOwners(options);
                const addresses = tokenIdOwners.result.map((e) => e.owner_of);
                setVoters(addresses);
            };


            fetchTokenIdOwners();
            getPolls();
            getPassRate();

        }
    }, [isInitialized]);


    return (
        <div className='container-fluid gradient-home pt-3'>
            <div className='row'>
                <div className='col-md-8 offset-md-2'>
                    {polls && (
                        <div>
                            <div className='container-fluid text-center'>
                                <h1 className='text-light'>Help Decide On Important Questions</h1>
                                <h8 className='text-light'>Get Your  DAO Voter NFT <LinkTo
                                    address="https://testnets.opensea.io/assets/mumbai/0x2953399124f0cbb46d2cbacd8a89cf0599974963/71876655463953535015688948417827604262466894376888337717173686517707277598730"
                                    text="Here"
                                    type="external"
                                /> to Propose and Vote on Polls</h8>
                            </div>


                            <div className='container mt-4'>
                                <div className='row justify-content-start'>
                                    <div className='col col-4 text-center'>

                                        <div className='container bg-light rounded-pill'>
                                            <div className='col p-1'>
                                                <div className='row row-6 mt-1'>
                                                    <h2>{totalP}</h2>
                                                </div>
                                                <div className='row row-6'>
                                                    <h6>Polls Created</h6>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className='col col-4 text-center'>

                                        <div className='container bg-light rounded-pill'>
                                            <div className='col p-1'>
                                                <div className='row row-6 mt-1'>
                                                    <h2>{voters.length}</h2>
                                                </div>
                                                <div className='row row-6'>
                                                    <h6>DAO Voters</h6>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <div className='col col-4 text-center'>
                                        <div className='container bg-light rounded-pill'>
                                            <div className='col p-1'>
                                                <div className='row row-6 mt-1'>
                                                    <h2>{totalP - counted}</h2>
                                                </div>
                                                <div className='row row-6'>
                                                    <h6>Open Polls</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='mt-4'>
                                <h2 className='text-light ms-2'> Recent Polls</h2>
                                <Table
                                    columnsConfig='10% 70% 20%'
                                    data={polls}
                                    header={[
                                        <span>ID</span>,
                                        <span>DESCRIPTION</span>,
                                        <span>STATUS</span>,
                                    ]}
                                    pageSize={5} />

                            </div>

                        </div>
                    )}
                    <div className='mb-4'>
                        <h2 className='text-light ms-2'>Create New Poll</h2>
                        <Form
                            buttonConfig={{
                                isLoading: sub,
                                loadingText: "submitting Poll",
                                text: "Submit",
                                theme: "secondary",
                                className: "mb-3"
                            }}
                            data={[
                                {
                                    inputWidth: "100%",
                                    name: "New Poll",
                                    type: "textarea",
                                    validation: {
                                        required: true,
                                    },
                                    value: "",
                                },
                            ]}
                            onSubmit={(e) => {
                                setSub(true);
                                createPoll(e.data[0].inputResult)
                            }}
                            title='Question'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home