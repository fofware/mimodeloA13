import { Router } from "express";
import { sameep } from "../../controlers/sameepControlers";
import { secheep } from "../../controlers/secheepControlers";
import { munircia } from "../../controlers/muniRciaControlers";

const router = Router();
router.get('/', (req,res) => {
  res.status(200).json('hola mundo')
});

router.get('/sameep', sameep);
router.get('/secheep', secheep);
router.get('/munircia', munircia);

export default router;