import React, { useContext } from 'react';
import {Link, useNavigate} from "react-router-dom";
import { SessionContext } from "../contexts/SessionContext";
import UserPool from "../components/UserPool";
import "../styles/user.css";

function User() {
    const { session } = useContext(SessionContext)
    return (
        <div className="user">
            <Link to="/profile">{session.loggedIn && <p>{session.username}</p>}</Link>
        </div>
    );
}   

export default User;