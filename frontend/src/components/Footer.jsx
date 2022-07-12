import React from 'react'
import logo from "../images/hiremedaologo.png";

function Footer() {
    return (
        <div className='gradient-navbar'>
            <div className='container'>
                <div className='row align-items-center'>
                    <div className='col col-6'>
                        <img className="" src={logo}></img>
                    </div>
                    <div className='col col-6 text-secondary'>
                        <h3>Created By: Matthew Stein</h3>
                        <h5>Email: matthew.k.setein.1@vanderbilt.edu</h5>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Footer