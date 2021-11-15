import React from 'react';

import classes from './LoadingScreen.module.css';


const LoadingScreen = (props) => {
    return(
        <div className={classes.container} style={{background: props.darkMode ? '#333333' : null }}>
            <div className={classes.load_holder}>
                <div className={classes.cssload}></div>
            </div>
        </div>
    );
}

export default LoadingScreen;