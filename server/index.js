const express = require('express');
const cors = require('cors');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const session = require('express-session');

const WebSocket = require('ws');
const SocketServer = require('ws').Server;

var users = [{"id":111, "username":"any", "password":"any"}];
 
passport.serializeUser(function (user, done) {
    done(null, users[0].id);
});
passport.deserializeUser(function (id, done) {
    done(null, users[0]);
});

passport.use('local-login', new LocalStrategy(
    function (username, password, done) {
        if (username === users[0].username && password === users[0].password) {
            return done(null, users[0]);
        } else {
            return done(null, false, {"message": "User not found."});
        }
    })
);

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    cors({
      origin: "http://localhost:3001", // <-- location of the react app were connecting to
      credentials: true,
    })
);

app.use(session({
    secret: "tHiSiSasEcRetStr",
    resave: true,
    saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
 
    res.sendStatus(401);
}
 
app.get("/", function (req, res) {
    res.send("Hello!");
});
 
app.get("/login", function (req, res) {
    res.send("login");
});
app.post("/login",
    passport.authenticate("local-login", { failureRedirect: "/login"}),
    function (req, res) {
        res.redirect("/chat");
});

app.get("/chat", isLoggedIn, function (req, res) {
    res.send({authenticated: true});
});

app.get('/logout', function(req, res) {
    req.logout();
    res.send('logout success!');
});


const server = app.listen(3000, () => {
    console.log('Server started at 3000..');
});

const wss = new SocketServer({ server, path: "/socket" });

wss.on('connection', (ws) => {

    console.log('[Server] A client was connected.');

    ws.on('close', () => { console.log('[Server] Client disconnected.') });

    ws.on('message', (message) => {

        console.log('[Server] Received message: %s', message);

        try {
        data = JSON.parse(message);
        console.log(data)
        if(data.type === 'DISCUSSION_COMMENT_ADD_COMMAND') {
            data['type'] = 'DISCUSSION_COMMENT_ADDED_EVENT'
        }
        } catch (e) {
        sendError(ws, 'Wrong format');
        return;
        }

        // broadcast to everyone else connected
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                let obj = {command: data.type, cmnt: data.cmnt, uuid: data.uuid};
                
                let delay = 3000;
                setTimeout(() => {
                    client.send(JSON.stringify(obj));
                }, delay);
            }
        });
    });

});