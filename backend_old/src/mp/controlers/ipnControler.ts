import { Request, Response, Router } from "express";
import { Socket } from "socket.io";
import io from '../../sockets'
class IpnControler {

  public router: Router = Router();

  constructor() {
		this.config();
	}

	config () {
    this.router.get('/mp/ipn', this.index );
    this.router.post('/mp/ipn', this.pindex );
  }

  index(req: Request, res: Response){
    const data:any = req.query;
    const io:Socket = req.app.get('sio');
    console.log("body",data);
    console.log('qry',req.query);
    io.emit("server:mp:ipn",req.query,data);
    res.status(200).json('ok');
  } 
  pindex(req: Request, res: Response){
    const data:any = req.body;
    const io:Socket = req.app.get('sio');
    console.log("POST",data);
    console.log('qry',req.query);
    io.emit("server:mp:ipn",req.query,data);
    res.status(200).json('ok');
  } 
}

export const ipnCtrl = new IpnControler();
