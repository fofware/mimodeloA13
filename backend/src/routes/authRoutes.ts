import { Router } from "express";
import * as auth from "../controlers/authControler";

const router = Router();

router.post('/signup', auth.signUp);
router.post('/signin', auth.signIn);
router.get('/emailcheck/:email', auth.emailcheck);
router.get('/nicknamecheck/:nickname', auth.nicknamecheck);

//router.post('/renew',passport.authenticate('jwt', {session:false}), renew);

export default router;