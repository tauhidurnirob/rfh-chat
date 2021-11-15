import React, { useState } from 'react';

import classes from './Login.module.css';
import { useAppState } from './SweetState/appState';
import { v4 as uuidv4 } from 'uuid';

const Login = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    //Global State
    const [, appActions] = useAppState();

    const loginHandler = () => {
        props.worker.postMessage({ op:'sendCommand', command: {
            "type" : "USER_LOGIN_COMMAND",
            "email" : email,
            "password" : pass,
            "commandId" : uuidv4()
            } });
        appActions.setLoading(true);
    }

    return(
        <div className ={ classes.overlay}>
            <div className={classes.login}>
                <input type="text" className={classes.input} placeholder="Enter Email" onChange={(e)=> setEmail(e.target.value)} />
                <input type="password" className={classes.input} placeholder="Enter Password" onChange={(e)=> setPass(e.target.value)} />
                <button className={classes.login_btn} onClick={loginHandler}>LOGIN</button>
            </div>
        </div>
    );
}

export default Login;