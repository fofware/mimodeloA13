//import { Router } from "express";
//import * as user from "../controlers/userController";
//import passport from "passport";
//
//const version = '/v1';
//const router = Router();
//router.get(`${version}/users`,
//          //passport.authenticate('jwt', {session:false}),
//          user.list)
///*
//router.post(`${version}/users`,
//          //passport.authenticate('jwt', {session:false}),
//          user.add)
//*/
//router.get(`${version}/users/:id`,
//          //passport.authenticate('jwt', {session:false}),
//          user.getById)
//router.put(`${version}/users/:id`,
//          //passport.authenticate('jwt', {session:false}),
//          user.update)
//router.delete(`${version}/users/:id`,
//          //passport.authenticate('jwt', {session:false}),
//          user.borrar)
//

//export default router;

import { Router } from "express";
import controler from '../controlers/genericControlers'
import modelo from "../models/user";
import passport from "passport";

const router = Router()
router.get('', 
            //passport.authenticate('jwt', {session:false}),
            controler.docGetAll(modelo, 
              {
                sort:{'artName':1, 'prodName': 1},
                projection: {'password': 0},
                fieldstr:['email', 'phone']
              })
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