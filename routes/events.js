import express from 'express';
import { createEvent, editEvent, deleteEvent, getAllEvents, getEventById,register,unregister } from '../controllers/events-controller.js';
import  {authenticate}  from '../util/auth.js';
import {upload} from '../util/upload.js';

const router = express.Router();

router.post('/', authenticate, upload.single('image'), createEvent);
router.put('/:id', authenticate,upload.single('image'),editEvent);
router.delete('/:id',authenticate, deleteEvent);
router.get('/', getAllEvents);
router.get('/:id', getEventById);

router.post('/:id/register', authenticate, register);
router.post('/:id/unregister', authenticate, unregister);


export default router;