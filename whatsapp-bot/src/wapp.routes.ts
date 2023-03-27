import { Router } from 'express';
import { Client } from 'whatsapp-web.js';
import fs from 'fs';
import whatsapp from './models/whatsapp';
import wappcontacts from './models/contacts';

export const setApiRoutes = async () => {
  /**
   * Routes
   */
  const router: Router = Router();
  router.get(`/:num/messages`, async (req, res) =>{
    const {num} = req.params
    const messages = await whatsapp.find({$or:[{from: `${num}@c.us`},{to: `${num}@c.us`}]}).sort({ timestamp: -1}).limit(200)
    res.status(200).json(messages);
  });
  return router;
}
