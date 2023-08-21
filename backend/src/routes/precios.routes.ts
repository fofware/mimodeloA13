import { Router } from "express";
import controler from '../controlers/genericControlers'
import modelo from "../models/precio";
import passport from "passport";

const router = Router()

router.get('', 
            controler.docGetAll(modelo)
          );
router.post('', 
            passport.authenticate('jwt', {session:false}),
            controler.docAdd
          );
router.get('/:_id', 
            passport.authenticate('jwt', {session:false}),
            controler.docGet(modelo,
              {
                searchBy:['_id']
              })
          );
router.put('/:_id', 
            passport.authenticate('jwt', {session:false}),
            controler.docGet(modelo,
              {
                searchBy:['_id']
              })
          );
router.delete('/:_id', 
            passport.authenticate('jwt', {session:false}),
            controler.docGet(modelo,
              {
                searchBy:['_id']
              })
          );

export = router; 