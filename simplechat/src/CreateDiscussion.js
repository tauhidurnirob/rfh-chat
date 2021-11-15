import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import classes from './CreateDiscussion.module.css';
import { useAppState } from './SweetState/appState';

const CreateDiscussion = (props) => {
    const [category, setCategory] = useState('Gaming');
    const [hashtag, setHashtag] = useState('');
    const [topic, setTopic] = useState('');

    //Global State
    const [appState, appActions] = useAppState();

    const disCreation = () => {
        props.worker.postMessage({
            op: 'sendCommand',
            command: {
                "type": "DISCUSSION_CREATE_COMMAND",
                "commandId": uuidv4(),
                "topic": topic,
                "hashtag": `#${hashtag}`,
                "category": category,
                "communityId": "88653fbb-5516-42d7-896d-376653e6bb5c"
            }
        });
        appActions.setLoading(true);
    }

    return(
        <div className={classes.wrapper}>
            <div className={classes.container}>
                <h2>Create Discussion</h2>
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
                <h4>Enter Hashtag</h4>
                <input type="text" placeholder="Enter Hashtag" onChange={(e)=> setHashtag(e.target.value)} />
                <h4>Enter Topic</h4>
                <input type="text" className="Enter Topic" onChange={(e)=> setTopic(e.target.value)} />

                <button className={classes.auth_btn} onClick={disCreation}>Create</button>
            </div>
        </div>
    );
}

export default CreateDiscussion;