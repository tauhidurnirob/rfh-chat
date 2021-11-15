import React, { useEffect, useState } from 'react';
import classes from './CreateCommunity.module.css';
import { v4 as uuidv4 } from 'uuid';
import { useAppState } from './SweetState/appState';

const CreateCommunity = (props) => {
    const [category, setCategory] = useState('Gaming');
    const [cmName, setCmName] = useState('');
    const [cmDescription, setCmDescription] = useState('');

    //Global State
    const [appState, appActions] = useAppState();

    const communityCreation = () => {
        props.worker.postMessage({
            op: 'sendCommand',
            command: {
                "type": "COMMUNITY_CREATE_COMMAND",
                "commandId": uuidv4(),
                "category": category,
                "communityName": cmName,
                "description": cmDescription
            }
        });
        appActions.setLoading(true);
    }

    useEffect(()=> {
        props.worker.postMessage({
            op: 'sendCommand',
            command: {
                "type": "CATEGORY_FETCH_QUERY"
            }
        });
        appActions.setLoading(true);
    },[])

    return(
        <div className={classes.wrapper}>
            <div className={classes.container}>
            <h2 style={{textAlign: "center"}}>Create Community</h2>
                <h4>Select Category</h4>
                <select onChange={(e)=> setCategory(e.target.value)}>
                    {
                        appState.categories?.map((cat, index)=> {
                            return(
                                <option key={index}>{cat.category}</option>
                            );
                        })
                    }
                </select>
                <h4>Enter Community Name</h4>
                <input type="text" placeholder="Enter community name" onChange={(e)=> setCmName(e.target.value)} />
                <h4>Enter Community Description</h4>
                <textarea placeholder="Enter Community Description" onChange={(e)=> setCmDescription(e.target.value)} />

                <button className={classes.auth_btn} onClick={communityCreation}>Create</button>
            </div>
        </div>
    );
}

export default CreateCommunity;
