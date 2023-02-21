import { Request, Response, Router } from "express";
import passport from "passport";
import ipn from "../models/ipn";
import url from 'url'
import config from '../config';
import { mp_httpClient } from "../client/mpUtils";
import webhooks from "../models/webhooks";

class ipnControlers {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config() {
    this.router.get('/ipn/new',
      this.ipn);
    this.router.post('/ipn/new',
      this.ipnp);
    this.router.get('/webhooks/new',
      this.webhooks);
    this.router.post('/webhooks/new',
      this.webhooksp);
    this.router.get('/ipn/process/:id',
      this.procesaipn);
  }

  async ipn(req: Request, res: Response) {
    console.log(req.query);
    const params = Object.assign({ method: 'GET' }, req.query, req.params, req.body);
    const reg = new ipn(params);
    const ret = await reg.save()
    console.log(ret);
    res.status(200).json('ok');
  }
  async ipnp(req: Request, res: Response) {
    const params = Object.assign({ method: 'POST' }, req.query, req.params, req.body);
    const reg = new ipn(params);
    const ret = await reg.save();
    console.log(params)
    res.status(200).json('ok');
  }
  async webhooks(req: Request, res: Response) {
    const params = Object.assign({ method: 'GET' }, req.query, req.params, req.body);
    const reg = new webhooks(params);
    const ret = await reg.save()
    console.log(params);
    res.status(200).json('ok');
  }
  async webhooksp(req: Request, res: Response) {
    const params = Object.assign({ method: 'POST' }, req.query, req.params, req.body);
    const reg = new webhooks(params);
    const ret = await reg.save()
    console.log(params);
    res.status(200).json('ok');
  }

  async procesaipn(req: Request, res: Response) {
    const params = Object.assign({}, req.query, req.params, req.body);
    const reg: any = await ipn.findById(params.id)
    console.log(reg);

    const rsc = url.parse(reg.resource);
    console.log(rsc);
    const options = {
      method: 'GET',
      port: 443,
      headers: { Authorization: `Bearer ${config.mp.prod.accessToken}` },
      host: `${rsc.hostname}`,
      path: `${rsc.path}`
    }
    let fromMp: any = "";
    fromMp = await mp_httpClient(options);
    res.status(200).json({ reg, fromMp });
  }
}

export const ipnCtrl = new ipnControlers();