import Database from 'better-sqlite3';
const db = new Database('./database.sqlite');

// Initialize the database
export function initializeDatabase() {
    db.exec("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT UNIQUE, password TEXT)");
    db.exec("CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY, title TEXT, description TEXT, address TEXT, date TEXT, image text, user_id INTEGER, FOREIGN KEY(user_id) REFERENCES users(id))");
    db.exec("CREATE TABLE IF NOT EXISTS registrations (event_id INTEGER, user_id INTEGER, PRIMARY KEY(event_id, user_id), FOREIGN KEY(event_id) REFERENCES events(id), FOREIGN KEY(user_id) REFERENCES users(id))");
}

initializeDatabase();

export function getDatabase() {
    if (!db) {
        throw new Error('Database connection is not established');
    }

    return db;
}
