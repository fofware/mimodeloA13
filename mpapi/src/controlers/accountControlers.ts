import { Request, Response, Router } from "express";
import passport from "passport";
import account from "../models/account";
import ipn from "../models/ipn";
import url from 'url'
import config from '../config';
import { mp_httpClient } from "../client/mpUtils";
import webhooks from "../models/webhooks";

class accountControlers {
	public router: Router = Router();

  constructor() {
		this.config();
	}

  config () {
    this.router.get('/account/list',
			this._list );
    this.router.post('/account',
      this._post );
    this.router.get('/account/:_id',
			this._get );
    this.router.put('/account/:_id',
      this._put );
    this.router.delete('/account/:_id',
      this._delete );
  }
  async _list(req: Request, res: Response){
    const def_params = {
      limit: 20,
      offset: 0,
    }
    const params = Object.assign({},req.query,req.params,req.body);
    const filter = {};
    let ret:any = {};
    let status = 200;
    try {
      const count = await account.count(filter);
      const rows = await account.find(filter);
      ret = {
        count,
        rows
      }        
    } catch (error) {
      console.log(error)
      status = 400;
      ret = error
    }
    res.status(status).json(ret);
  }
  async _post(req: Request, res: Response){
    const params = Object.assign({},req.query,req.params,req.body);
    let status = 200;
    let ret:any = {};
    try {
      const reg = new account(params);
      ret = await reg.save();
    } catch (error) {
      console.log(error);
      status = 400;
      ret = error;
    }
    res.status(status).json(ret);
  }
  async _get(req: Request, res: Response){
    const params = Object.assign({},req.query,req.params,req.body);
    console.log(params);
    let status = 200;
    let ret:any = {};
    try {
      ret = await account.findById(params._id);  
    } catch (error) {
      status = 400;
      ret = error;
    }
    res.status(status).json(ret);
  }
  async _put(req: Request, res: Response){
    const params = Object.assign({},req.query,req.params,req.body);
    let status = 200;
    let ret:any = {};
    try {
      ret = account.findByIdAndUpdate(params._id);
      console.log(ret);
      /*
      const exists = await account.count({_id:params._id});
      if (exists === 1){
        const reg = new account(params);
        ret = await reg.save();
      } else {
        status = 404;
        ret = "No se pudo individualizar el Registro";
      }
      */
    } catch (error) {
      console.log(error);
      status = 400;
      ret = error;
    }
    res.status(status).json(ret);
  }
  async _delete(req: Request, res: Response){
    const params = Object.assign({},req.query,req.params,req.body);
    console.log(params);
    let status = 200;
    let ret:any = {};
    try {
      ret = await account.findByIdAndDelete(params._id);
      console.log(ret);
    } catch (error) {
      status = 400;
      ret = error;      
    }
    res.status(status).json(ret);
  }
}

export const accountCtrl = new accountControlers();