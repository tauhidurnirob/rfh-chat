import React, { useRef, useEffect } from 'react';
import { useQueryClient } from 'react-query';

import classes from './Chat.module.css';

// import { useLiveQuery } from "dexie-react-hooks";

import db from './Dexie/db';

import InputField from './InputField';
import { useCmnts } from './Queries';
import { useComments } from './SweetState/SweetState';

const Chat = (props) => {
    const [state, actions] = useComments();
    
    const { v4: uuidv4 } = require('uuid');

    const commandQueqe = useRef([]);

    const workerInstance = props.worker;

    const queryClient = useQueryClient();

    const handleKey = (inputVal) => {
        let uuid = uuidv4();
        let obj = {type: 'DISCUSSION_COMMENT_ADD_COMMAND', cmnt: inputVal, uuid: uuid};
        workerInstance.postMessage({op:'add', value: obj});
        commandQueqe.current.push(obj);
        console.log(commandQueqe.current);
    }

    workerInstance.onmessage = e => {
        let data = JSON.parse(e.data);
        commandQueqe.current = commandQueqe.current.filter(f => f.uuid !== data.uuid);
        // db.comments.toArray().then((cmnts) => {
        //     actions.setStore(cmnts);
        // }).catch((error)=> {
        // alert ("Ooops: " + error);
        // })
        // queryClient.setQueriesData(["msgs"], (oldData) => {
        //     const update = (entity) =>
        //       entity.id === data.id ? { ...entity, ...data.payload } : entity
        //     return Array.isArray(oldData) ? oldData.map(update) : update(oldData)
        //   })
        queryClient.refetchQueries();
        console.log(data.cmnt);
        console.log(commandQueqe.current);
    }

    const clearClicked = () => {
        workerInstance.postMessage({op:'add', value: 'clear'});
    }
    // db.comments.clear()

    // const comments = useLiveQuery(
    //     () => db.comments.toArray()
    // );
    // console.log(comments)
    // if (!comments) return null;

    // useEffect(()=> {
    //     db.comments.toArray().then((cmnts) => {
    //       actions.setStore(cmnts);
    //     }).catch((error)=> {
    //       alert ("Ooops: " + error);
    //     })
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // },[])

    useEffect(() => {
        workerInstance.postMessage({op:'connect'});
    
        return () => { workerInstance.postMessage({op:'close'}); }
    },[workerInstance]);

    const { isLoading, error, data } = useCmnts();

    return(
        <div className={classes.wrapper}>
            <div className={classes.chat_area}>
            {
                isLoading ?
                <p>Loading...</p>
                : error ?
                <p>Error occured...</p>
                :
                data?.map((a, index) => (
                    <h1 key={index}>{a.cmnt}</h1>
                ))
                }
            </div>
            <InputField handleKey={handleKey} />
            <button onClick={props.logOutClicked}>LOG OUT</button>
            <button onClick={clearClicked}>Clear</button>
        </div>
    );
}

export default Chat;