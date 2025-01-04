import { create, edit, deleteItem, getAll, getSingle, registerEvent, unregisterEvent } from '../models/event.js';


export async function createEvent(req, res) {
    const { title, description, address, date } = req.body;
    const userId = req.user.id;
    const image = req.file.filename;
    console.log("Fields",  req.body.title, req.body.description, req.body.address, req.body.date, req.user.id, req.file);

    if (!title?.trim() || !description?.trim() || !address?.trim() || !date?.trim() || !userId) {
        return res.status(400).json({ message: 'All fields are required and cannot be empty' });
    }

    try {
        const event = await create(title, description, address, date, image, userId);
        return res.status(201).json(event);
    } catch (err) {
        return res.status(500).json({ message: 'Error creating event', error: err.message });
    }
}

export async function editEvent(req, res) {
    const { id } = req.params;
    const { title, description, address, date } = req.body;
    const userId = req.user.id;
    const image = req.file.filename;
    console.log("Fields",  req.body.title, req.body.description, req.body.address, req.body.date, req.user.id, req.file);
    if (!title.trim() || !description.trim() || !address.trim() || !date.trim()||!image) {
        return res.status(400).json({ message: 'All fields are required and cannot be empty' });
    }

    try {
        const event = await getSingle(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.user_id !== userId) {
            return res.status(403).json({ message: 'You are not authorized to edit this event' });
        }
    

        const updatedEvent = await edit(id, title, description, address, date, image);
        return res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (err) {
        res.status(500).json({ message: 'Error updating event', error: err.message });
    }
}

export async function deleteEvent(req, res) {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const event = await getSingle(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.user_id !== userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this event' });
        }

        await deleteItem(id);
        return res.status(200).json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting event', error: err.message });
    }
}

export async function getAllEvents(req, res) {
    try {
        const events = await getAll();
        return res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving events', error: err.message });
    }
}

export async function getEventById(req, res) {
    const { id } = req.params;
    try {
        const event = await getSingle(id);
        if (event) {
            return res.status(200).json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving event', error: err.message });
    }
}

export async function register(req, res) {
    const { id: eventId } = req.params;
    const userId = req.user.id;

    try {
        const event = await getSingle(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        console.log(eventId, userId);
        await registerEvent(eventId, userId);
        return res.status(200).json({ message: 'Registered to event successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error registering to event', error: err.message });
    }
}

export async function unregister(req, res) {
    const { id: eventId } = req.params;
    const userId = req.user.id;

    try {
        const event = await getSingle(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        await unregisterEvent(eventId, userId);
        return res.status(200).json({ message: 'Unregistered from event successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error unregistering from event', error: err.message });
    }
}