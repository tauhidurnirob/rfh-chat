import React, { useState } from "react";
import classes from './UserImageUpload.module.css';

import thumbnail from './thumbnail.png';
import { useAppState } from "./SweetState/appState";

const UserImageUpload = (props) => {
    const [,appActions] = useAppState();
    const [selectedFile, setSelectedFile] = useState(thumbnail);

    const fileChangedHandler = (event) => {
        let src= URL.createObjectURL(event.target.files[0]);
        setSelectedFile(src);
    }

    const onSubmit = () => {
        appActions.setLoading(true);
        props.worker.postMessage({
            op: "sendCommand",
            command: {
                "type" : "USER_IMAGE_UPLOAD_COMMAND",
                "image" : selectedFile.replace("data:", "").replace(/^.+,/, "")
            }  
        });
    }

    return(
        <div className={classes.wrapper}>
            <div className={classes.container}>
                <div className={classes.image_holder}>
                    <img src={selectedFile} alt="Pic" />
                </div>
                <input className={classes.input} type="file" accept="image/gif, image/jpeg, image/png" name="image" id="upfile" onChange={fileChangedHandler} />
                <label className={classes.upload_btn} htmlFor="upfile" >Upload</label>

                <button className={classes.auth_btn} onClick={onSubmit}>submit</button>
            </div>
        </div>
    );
}

export default UserImageUpload;
