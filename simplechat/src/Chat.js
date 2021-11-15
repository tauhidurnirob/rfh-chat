import React, { useEffect, useRef } from 'react';
import { useQueryClient } from 'react-query';

import classes from './Chat.module.css';

// import { useLiveQuery } from "dexie-react-hooks";

import db from './Dexie/db';

import InputField from './InputField';
import { useCmnts } from './Queries';
import { useComments } from './SweetState/SweetState';
import { v4 as uuidv4 } from 'uuid';
import { useAppState } from './SweetState/appState';
import { useAuthState } from './SweetState/authState';
import { useNavigate } from 'react-router';
import { getCookie } from './CustomMethods';

const Chat = (props) => {
    const [appState] = useAppState();
    const [authState, authActions] = useAuthState();
    const [state, actions] = useComments();

    const commandQueqe = useRef([]);

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const handleKey = (inputVal) => {
        // let uuid = uuidv4();
        // let obj = {type: 'DISCUSSION_COMMENT_ADD_COMMAND', cmnt: inputVal, uuid: uuid};
        // workerInstance.postMessage({op:'add', value: obj});
        // commandQueqe.current.push(obj);
        // console.log(commandQueqe.current);
        props.worker.postMessage({
            op: 'sendCommand',
            command:  {
                "type" : "DISCUSSION_COMMENT_CREATE_COMMAND",
                "commandId" : uuidv4(),
                "discussionId" : "e57fe12c-091d-4a91-9662-603fa80e7394",
                "comment" : inputVal
            } 
        });
    }

    const logOutHandler  = () => {
        authActions.logOut();
        navigate('/login');
    }
    console.log(getCookie('sessionId'))
    useEffect(()=> {
        if(authState.loggedIn) {
            props.worker.postMessage({
                op: 'reConnect',
                sessionId: getCookie('sessionId')
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const clearClicked = () => {
        // workerInstance.postMessage({op:'add', value: 'clear'});
    }
    // db.comments.clear()

    // const comments = useLiveQuery(
    //     () => db.comments.toArray()
    // );
    // console.log(comments)
    // if (!comments) return null;


    // const { isLoading, error, data } = useCmnts();
    return(
        <div className={classes.wrapper}>
            <div className={classes.chat_area}>
                {/* {
                isLoading ?
                <p>Loading...</p>
                : error ?
                <p>Error occured...</p>
                :
                data?.map((a, index) => (
                    <h1 key={index}>{a.cmnt}</h1>
                ))
                } */}
                {
                    appState.comments?.map((a, index) => {
                        return(
                            <h1 key={index}>{a.comment}</h1>
                        );
                    })
                }
            </div>
            <InputField handleKey={handleKey} />
            <button onClick={logOutHandler}>LOG OUT</button>
            <button onClick={clearClicked}>Clear</button>
        </div>
    );
}

export default Chat;