const { default: db } = require("./Dexie/db");

let ws;

onmessage = e => {
    if(e.data.op === 'connectAWS') {
        ws = new WebSocket("wss://vjpnc8hgsa.execute-api.us-east-2.amazonaws.com/test");
        ws.onopen = () => {
            console.log("open aws connection");
            sendMessage();
        };
        const sendMessage = () => {
            postMessage(JSON.stringify({'type': 'WEBSOCKET_CONNECTED_EVENT'}));
        }
    }
    else if(e.data.op === 'secureConnect') {
        ws.close();
        ws = new WebSocket(`wss://ymse3qdomd.execute-api.us-east-2.amazonaws.com/test?sessionId=${e.data.sessionId}`);

        ws.onopen = () => {
            console.log("Secure connection established");
            sendMessage();
        };
        const sendMessage = () => {
            postMessage(JSON.stringify({'type': 'SECURE_CONNECT_EVENT'}));
        }
    }
    else if(e.data.op === 'reConnect') {
        ws = new WebSocket(`wss://ymse3qdomd.execute-api.us-east-2.amazonaws.com/test?sessionId=${e.data.sessionId}`);

        ws.onopen = () => {
            console.log("Reconnected");
            sendMessage();
        };
        const sendMessage = () => {
            postMessage(JSON.stringify({'type': 'SECURE_CONNECT_EVENT'}));
        }
    }
    else if(e.data.op === 'sendCommand') {
        ws.send(JSON.stringify(e.data.command));
    }
    else if(e.data.op === 'close') {
        ws.close();
    }

    ws.onclose = () => {
        console.log('disconnected');
    };
    ws.onmessage = msg => {
        // const ms = JSON.parse(msg.data)
        postMessage(msg.data);
    };
}
