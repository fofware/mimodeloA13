import { Router } from "express";
import { sameep } from "../../controlers/sameepControlers";

const router = Router();
router.get('/', (req,res) => {
  res.status(200).json('hola mundo')
});

router.get('/sameep', sameep);

export default router;