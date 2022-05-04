import { Request, Response, Router } from "express";
import { mp_httpClient } from "../mpUtils";
import config from '../../config';

export class SucursalesControler {
  public router: Router = Router();
  constructor() {
		this.config();
	}
  config(){
    this.router.get('/mp/sucursales', this.list );
    this.router.get('/mp/sucursal/:id', this.get );
    this.router.post('/mp/sucursal/', this.add );
    this.router.put('/mp/sucursal/:id', this.update );
    this.router.delete('/mp/sucursal/:id',this.borrar)

  }
  /*
  * Leer sucursales
    curl -X GET \
    'https://api.mercadopago.com/users/84242924/stores/search?external_id=' \
    -H 'Authorization: Bearer APP_USR-3527848825753216-092312-d134a8310ed3d5d70356f30ad0a3d176-84242924' 
    
    curl -X GET \
    'https://api.mercadopago.com/users/{user_id}/stores/search?external_id=SUC001' \
    -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' 

    curl -H 'Authorization: Bearer APP_USR-3527848825753216-092312-d134a8310ed3d5d70356f30ad0a3d176-84242924'  \
      https://api.mercadopago.com/V1/payments
  */
  async list(req: Request, res: Response){
    let params = {
      limit: 20,
      offset: 0
    }
    params = Object.assign(params,req.query,req.body);

    const options = {
      host: 'api.mercadopago.com',
      path: `/users/${config.mp.userID}/stores/search?offset=0&limit=10`,
      method: 'GET',
      port: 443,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${config.mp[config.mp.mode].accessTocken}`,
        'Content-Type': 'application/json; charset=UTF-8'
      }
    };
    try {
      const data = await mp_httpClient(options);
      res.json(data);
    } catch (error) {
      res.json(error);
    }
  }
  get(req: Request, res: Response){}
  add(req: Request, res: Response){}
  update(req: Request, res: Response){}
  borrar(req: Request, res: Response){}
  

}

export const SucursalesCtrl = new SucursalesControler();
