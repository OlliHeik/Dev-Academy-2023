import React from 'react'
import Logo from "../img/logo.png"
import {Link} from "react-router-dom"

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="container">
                <div className="logo">
                    <img src={Logo} alt=""/>
                </div>
                <h1>HELSINKI CITY BIKE</h1>
                <div className="links">                    
                    <Link className="link" to="/">
                        <h6>HOME</h6>
                    </Link>
                    <Link className="link" to="/journeys">
                        <h6>JOURNEYS</h6>
                    </Link>
                    <Link className="link" to="/stations">
                        <h6>STATIONS</h6>
                    </Link>

                    <span className="add">
                        <Link className="add-link">ADD JOURNEY</Link>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Navbar