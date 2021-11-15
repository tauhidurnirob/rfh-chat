import React, { useEffect } from 'react';

import classes from './Home.module.css';
import { useAppState } from './SweetState/appState';

const Home = (props) => {
    const [, appActions] = useAppState();

    useEffect(() => {
        props.worker.postMessage({op:'connectAWS'});
        appActions.setLoading(true);
    
        // return () => { props.worker.postMessage({op:'close'}); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    return(
        <div className={classes.wrapper}>
            <h1 className={classes.h_text}>Welcome to SimpleChat!</h1>
            <h1 className={classes.h2_text}>Hi <span style={{color: 'darkcyan'}}>{props.userName}</span></h1>

            <button className={classes.auth_btn} onClick={props.loginClicked}>Login</button>
            <button className={classes.auth_btn} onClick={props.authGuestClicked} style={{background: '#8a2be2b8'}}>Continue as Guest</button>
        </div>
    );
}

export default Home;