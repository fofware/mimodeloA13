import { Router } from "express";
import * as auth from "../controlers/authControler";
import passport from "passport";

const router = Router();

router.post('/signup', auth.signUp);
router.post('/signin', auth.signIn);
router.get('/emailcheck/:email', auth.emailcheck);
router.get('/nicknamecheck/:nickname', auth.nicknamecheck);
/*
router.get('/usermenu',
            //passport.authenticate('jwt', {session:false}),
            auth.getmenu);
router.get('/usermenu/logged',
            passport.authenticate('jwt', {session:false}),
            auth.getmenu);
*/

router.get('/usermenu/:id',
            //passport.authenticate('jwt', {session:false}),
            auth.getmenu);
router.get('/usermenu/logged/:id',
            passport.authenticate('jwt', {session:false}),
            auth.getmenu);
//router.post('/renew',passport.authenticate('jwt', {session:false}), renew);
router.get('/fullmenu/:id',
            //passport.authenticate('jwt', {session:false}),
            auth.fullmenu);
router.get('/fullmenu/logged/:id',
            passport.authenticate('jwt', {session:false}),
            auth.fullmenu);
/*
router.get('/verify/email',
            passport.authenticate('jwt', {session:false}),
            auth.ver);
router.get('/verify/email/new',
            passport.authenticate('jwt', {session:false}),
            auth.newEmailCode);
export default router;
*/
export default router;