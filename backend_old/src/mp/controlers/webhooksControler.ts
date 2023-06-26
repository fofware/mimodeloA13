import { Request, Response, Router } from "express";
import { Socket } from "socket.io";

export class WebHooksControler {

  public router: Router = Router();

  constructor() {
		this.config();
	}

	config () {
    this.router.get('/mp/webhooks', this.index );
    this.router.post('/mp/webhooks', this.pindex );
  }

  index(req: Request, res: Response){
    const data:any = req.query;
    const io:Socket = req.app.get('sio');
    console.log("POST",data);
    console.log('qry',req.query);
    io.emit("server:mp:webhooks",{qry:req.query,post:data});
    console.log(data);
    res.status(200).json('ok');
  } 
  pindex(req: Request, res: Response){
    const data:any = req.body;
    console.log(data);
    const io:Socket = req.app.get('sio');
    console.log("POST",data);
    console.log('qry',req.query);
    io.emit("server:mp:webhooks",{qry:req.query,post:data});
    res.status(200).json('ok');
  } 
}

export const WebHooksCtrl = new WebHooksControler();
