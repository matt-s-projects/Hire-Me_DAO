import React from 'react'
import { ConnectButton } from "web3uikit"
import logo from "../images/hiremedaologo.png";


function Navbar() {
    return (
        <div className='container-fluid gradient-navbar p-2'>
            <div className='row align-items-center justify-content-between'>
                <div className="col col-md-4 offset-2">
                    <img src={logo} alt="logo" />
                </div>
                <div className="col col-md-5 mt-2 align-items-center">
                    <ConnectButton />
                </div>
            </div>





        </div>
    )
}

export default Navbar