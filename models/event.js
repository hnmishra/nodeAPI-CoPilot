import { getDatabase } from '../database.js';

const db = getDatabase();


export async function create(title, description, address, date, image, userId) {
    try {
        const stmt = db.prepare("INSERT INTO events (title, description, address, date, image, user_id) VALUES (?, ?, ?, ?, ?, ?)");
        const info = await stmt.run(title, description, address, date, image, userId);
        const event = { id: info.lastInsertRowid, title, description, address, date, image, userId };
        console.log('Event created:', title);
        return event;
    } catch (err) {
        console.error('Error creating event:', err);
        throw err;
    }
}

export async function edit(id, title, description, address, date, image) {
    try {
        const stmt = db.prepare("UPDATE events SET title = ?, description = ?, address = ?, date = ?, image = ? WHERE id = ?");
        stmt.run(title, description, address, date, image, id);
        const event = { id, title, description, address, date, image };
        return event;
    } catch (err) {
        console.error('Error updating event:', err);
        throw err;
    }
}

export async function deleteItem(id) {
    try {
        const stmt = db.prepare("DELETE FROM events WHERE id = ?");
        await stmt.run(id);
        console.log('Event deleted:', id);
    } catch (err) {
        console.error('Error deleting event:', err);
        throw err;
    }
}

export async function getAll() {
    try {
        const stmt = db.prepare("SELECT * FROM events");
        const events =  stmt.all();
        console.log('All events retrieved');
        return events;
    } catch (err) {
        console.error('Error retrieving events:', err);
        throw err;
    }
}

export async function getSingle(id) {
    try {
        const stmt = db.prepare("SELECT * FROM events WHERE id = ?");
        const event = await stmt.get(id);
        return event;
    } catch (err) {
        console.error('Error retrieving event:', err);
        throw err;
    }
}

export async function registerEvent(eventId, userId) {
    try {
        const stmt = db.prepare("INSERT INTO registrations (event_id, user_id) VALUES (?, ?)");
        await stmt.run(eventId, userId);
        console.log('User registered for event:', eventId);
    } catch (err) {
        console.error('Error registering for event:', err);
        throw err;
    }
}

export async function unregisterEvent(eventId, userId) {
    try {
        const stmt = db.prepare("DELETE FROM registrations WHERE event_id = ? AND user_id = ?");
        await stmt.run(eventId, userId);
        console.log('User unregistered from event:', eventId);
    } catch (err) {
        console.error('Error unregistering from event:', err);
        throw err;
    }
}



