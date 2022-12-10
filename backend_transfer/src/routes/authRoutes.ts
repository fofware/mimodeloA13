import { Router } from "express";
import * as auth from "../controlers/authControler";

const router = Router();

router.post('/signup', auth.signUp);
router.post('/signin', auth.signIn);
router.get('/emailcheck/:email', auth.emailcheck);
//router.post('/renew',passport.authenticate('jwt', {session:false}), renew);

export default router;

/*
Para amanzar los caballos el obero se fue a baranda 
porque no le daban de comer donde estaba 
Jorge Obregón que lo a tu sobrino
*/
