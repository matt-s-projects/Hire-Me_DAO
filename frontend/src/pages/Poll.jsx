import React, { useState, useEffect } from "react";
import { Tag, Widget, Blockie, Tooltip, Icon, Form, Table } from "web3uikit";
import { Link } from "react-router-dom";
import { useLocation } from "react-router";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";

function Poll() {
    const { state: pollDetails } = useLocation();
    const { Moralis, isInitialized } = useMoralis();
    const [latestVote, setLatestVote] = useState();
    const [percUp, setPercUp] = useState(0);
    const [percDown, setPercDown] = useState(0);
    const [votes, setVotes] = useState([]);
    const [sub, setSub] = useState(false);
    const contractProcessor = useWeb3ExecuteFunction();


    useEffect(() => {
        if (isInitialized) {

            async function getVotes() {

                const Votes = Moralis.Object.extend("Votes");
                const query = new Moralis.Query(Votes);
                query.equalTo("proposal", pollDetails.id);
                query.descending("createdAt");
                const results = await query.find();
                if (results.length > 0) {
                    setLatestVote(results[0].attributes);
                    setPercDown(
                        (
                            (Number(results[0].attributes.votesDown) /
                                (Number(results[0].attributes.votesDown) +
                                    Number(results[0].attributes.votesUp))) *
                            100
                        ).toFixed(0)
                    );
                    setPercUp(
                        (
                            (Number(results[0].attributes.votesUp) /
                                (Number(results[0].attributes.votesDown) +
                                    Number(results[0].attributes.votesUp))) *
                            100
                        ).toFixed(0)
                    );
                }


                const votesDirection = results.map((e) => [
                    e.attributes.voter,
                    <Icon
                        fill={e.attributes.votedFor ? "#2cc40a" : "#d93d3d"}
                        size={24}
                        svg={e.attributes.votedFor ? "checkmark" : "arrowCircleDown"}
                    />,
                ]);

                setVotes(votesDirection);

            }
            getVotes();

        }
    }, [isInitialized]);

    async function castVote(forAgainst) {
        let options = {
            contractAddress: "0x28F9Ad2239fD3acC0431223C5660aE8F779B5061",
            functionName: "voteOnPoll",
            abi: [
                {
                    inputs: [
                        {
                            internalType: "uint256",
                            name: "_id",
                            type: "uint256",
                        },
                        {
                            internalType: "bool",
                            name: "_vote",
                            type: "bool",
                        },

                    ],
                    name: "voteOnPoll",
                    outputs: [],
                    stateMutability: "nonpayable",
                    type: "function",
                },
            ],
            params: {
                _id: pollDetails.id,
                _vote: forAgainst,
            },
        };
        await contractProcessor.fetch({
            params: options,
            onSuccess: () => {
                //console.log("Poll Succesful");
                setSub(false);
            },
            onError: (error) => {
                alert(error.data.message);
                setSub(false);
            },
        });
    }



    return (
        <div className="gradient-home">



            <div className='container'>
                <div className='col'>
                    <div className='row row-3'>
                        <Link to="/">
                            <button type="button" className="btn btn-outline-light mt-3">
                                Home
                            </button>
                        </Link>
                    </div>
                    <div className='row row-6 my-3'>
                        <h1 className='text-light text-center'>
                            {pollDetails.description}
                        </h1>
                        <h8 className="text-light text-center">Created By: {pollDetails.proposer} </h8>
                    </div>
                </div>
            </div>


            <div className='container mt-4'>
                <div className='row align-items-center'>
                    {latestVote && (
                        <div className='col col-4 offset-1'>
                            <div className="mb-2">
                                <Tag color={pollDetails.color} text={pollDetails.text} />
                            </div>
                            <div className="mb-4 bg-light p-3 rounded">
                                <h3 className="text-secondary">Votes For: {latestVote.votesUp}</h3>
                                <div className="bg-secondary rounded-pill">

                                    <div className="bg-primary rounded-pill text-primary" style={{ width: `${percUp}%` }}>
                                        .
                                    </div>

                                </div>
                            </div>
                            <div className="mb-4 bg-light p-3 rounded">
                                <h3 className="text-secondary">Votes Against: {latestVote.votesDown}</h3>
                                <div className="bg-secondary rounded-pill">

                                    <div className="bg-primary rounded-pill text-primary" style={{ width: `${percDown}%` }}>
                                        .
                                    </div>

                                </div>
                            </div>


                        </div>
                    )}
                    <div className='col col-6'>

                        <Form
                            isDisabled={pollDetails.text !== "Ongoing"}
                            buttonConfig={{
                                isLoading: sub,
                                loadingText: "Submitting Vote",
                                theme: "secondary",
                            }}
                            data={[
                                {
                                    name: "Vote",
                                    options: ["For", "Against"],
                                    type: "radios",
                                    value: "Cast Vote",
                                    validation: {
                                        required: true,
                                    },
                                },
                            ]}
                            onSubmit={(e) => {
                                if (e.data[0].inputResult[0] === "For") {
                                    castVote(true);
                                } else {
                                    castVote(false);
                                }
                                setSub(true);
                            }}
                        />

                    </div>

                </div>
            </div>

            <div className='container mt-4'>
                <div className="row">
                    <div className="col col-10 offset-1">
                        <h3 className='text-light'>Voting History</h3>
                        <Table
                            style={{ width: "100%" }}
                            columnsConfig='90% 10%'
                            data={votes}
                            header={[<span>Address</span>, <span>Vote</span>]}
                            pageSize={5}
                        />
                    </div>
                </div>
            </div>





        </div>
    )
}

export default Poll