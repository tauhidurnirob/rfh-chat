import Dexie from 'dexie';

const db = new Dexie('messages');
db.version(1).stores({ comments: 'id++, text' });

export default db;


