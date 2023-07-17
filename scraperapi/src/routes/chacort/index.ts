import { Router } from "express";
import { sameep } from "../../controlers/sameepControlers";
import { secheep } from "../../controlers/secheepControlers";
import { munircia, munirciaVehiculos, web_munirciaInmuebles } from "../../controlers/muniRciaControlers";
import { totales } from "../../controlers/afipControler";

const router = Router();
router.get('/', (req,res) => {
  res.status(200).json('hola mundo')
});

router.get('/sameep', sameep);
router.get('/secheep', secheep);
router.get('/munircia', munircia);
router.get('/munircia/vehiculos', munirciaVehiculos);
router.get('/munircia/inmuebles', web_munirciaInmuebles);
router.get('/totales', totales)

export default router;