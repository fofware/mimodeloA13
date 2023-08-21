import { Router } from "express";
import controler from '../controlers/genericControlers'
import modelo from "../models/productoname";
import passport from "passport";

const router = Router()
router.get('', 
            controler.docGetAll(modelo, 
              {
                sort:{'artName':1, 'prodName': 1},
                fieldstr:['sText', 'tags']
              })
          );
router.get('/:_id', 
            controler.docGet(modelo, 
              {
                searchBy:['_id']
              })
          );
router.put('/:_id', 
            passport.authenticate('jwt', {session:false}),
            controler.docGet(modelo,{searchBy:['_id']})
          );
router.delete('/:_id', 
            passport.authenticate('jwt', {session:false}),
            controler.docGet(modelo,
              {
                searchBy:['_id']
              })
          );

export = router;