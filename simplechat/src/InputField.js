import React, { useState } from 'react';

import classes from './Chat.module.css';


const InputField = (props) => {
    const [inputVal, setInputVal] = useState('');

    const inputOnChange = (e) => {
        setInputVal(e.target.value);
    }

    const handleKey = (event) => {
        if (event.code === "Enter" || event.code === "NumpadEnter") {
            props.handleKey(inputVal);
            setInputVal('');
        }
    }

    return(
        <input type="text" className={classes.input_field} onChange={(e)=> inputOnChange(e)} onKeyPress = {(e)=> handleKey(e)} value={inputVal} />
    );
}

export default InputField;