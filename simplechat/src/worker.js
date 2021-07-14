const { default: db } = require("./Dexie/db");

let ws;

onmessage = e => {
    if(e.data.op === 'connect') {
        ws = new WebSocket("ws://localhost:3000/socket");
        ws.onopen = () => {
            console.log("open connection");
        };
    }
    else if(e.data.op === 'close') {
        ws.close();
    }
    else if (e.data.op === 'add') {
        ws.send(JSON.stringify(e.data.value));
        ws.onmessage = msg => {
            console.log("getMessage", msg.data);
            let data = JSON.parse(msg.data);
            db.comments.add({
                text: data.cmnt
            }).then(()=> {
                postMessage(msg.data);
            }).catch((err)=> {
                window.alert(err);
            })
        };
    }
}
