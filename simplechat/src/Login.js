import React, { useState } from 'react';

import classes from './Login.module.css';


const Login = (props) => {
    const [userName, setUserName] = useState('');
    const [pass, setPass] = useState('');

    return(
        <div className ={ classes.overlay}>
            <div className={classes.login}>
                <input type="text" className={classes.input} onChange={(e)=> setUserName(e.target.value)} />
                <input type="text" className={classes.input} onChange={(e)=> setPass(e.target.value)} />
                <button className={classes.login_btn} onClick={()=>props.loginClicked(userName, pass)}>LOGIN</button>
            </div>
        </div>
    );
}

export default Login;