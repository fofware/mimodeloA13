import { Router } from "express";
import * as auth from "../controlers/authControler";
import * as authMenu from '../controlers/authControler/menues';
import * as authForGotPass from '../controlers/authControler/resetpassword';
import * as authEmail from '../controlers/authControler/email'
import passport from "passport";
import { verify } from "jsonwebtoken";
import { verifyCode } from "../controlers/authControler/verifycode";

const router = Router();

router.post('/signup', auth.signUp);
router.post('/signin', auth.signIn);
router.get('/emailcheck/:email', auth.emailcheck);
router.get('/nicknamecheck/:nickname', auth.nicknamecheck);
router.post('/pass/rst/code/new', authForGotPass.newcode)
router.post('/pass/rst/code/verify', authForGotPass.confirmVerifycode)
router.get('/pass/rst/code/verify', authForGotPass.confirmVerifycode)
router.post('/pass/rst',auth.savePassword)
router.post('/pass/change',
              passport.authenticate('jwt', {session:false}),
              auth.changePassword
            )
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
            authMenu.getmenu);
router.get('/usermenu/logged/:id',
            passport.authenticate('jwt', {session:false}),
            authMenu.getmenu);
//router.post('/renew',passport.authenticate('jwt', {session:false}), renew);
router.get('/fullmenu/:id',
            //passport.authenticate('jwt', {session:false}),
            authMenu.fullmenu);
router.get('/fullmenu/logged/:id',
            passport.authenticate('jwt', {session:false}),
            authMenu.fullmenu);
router.post('/confirm/email',
            passport.authenticate('jwt', {session:false}),
            authEmail.verifyEmailCode);
router.get('/comfirm/email/new',
            passport.authenticate('jwt', {session:false}),
            authEmail.newEmailCode);
router.get('/comfirm/reset/verify',
            authForGotPass.confirmVerifycode) 
export default router;