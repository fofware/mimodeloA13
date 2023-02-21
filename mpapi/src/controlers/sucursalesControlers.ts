import { Request, Response, Router } from "express";
import { mp_httpClient, mp_makeUri } from "../client/mpUtils";
import config from '../config';

export class SucursalesControler {
  public router: Router = Router();
  constructor() {
		this.config();
	}
  config(){
    this.router.get('/sucursales', this.sucursales );
    this.router.get('/sucursal/:id', this.sucursal );
    this.router.post('/sucursal', this.sucursal );
    this.router.put('/sucursal/:id', this.sucursal );
  }
  /**
   * curl -X GET \
      'https://api.mercadopago.com/users/{user_id}/stores/search?external_id=SUC001' \
      -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' 
   * @param req 
   * @param res 
   */
  async sucursales(req: Request, res: Response){
    const def_params = {
      limit: 50,
      offset: 0,
    }
    //const qry = Object.assign({},req.query,req.params,req.body);
    const qry = mp_makeUri(def_params,req.query,req.body);
    const options = {
      path: `/users/${config.mp.userID}/stores/search${qry}`,
    };
    try {
      const data = await mp_httpClient(options);
      res.json(data);
    } catch (error) {
      res.json(error);
    }
  }
  /**
   * curl -X GET \
      'https://api.mercadopago.com/stores/{id}' \
      -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' 
   * @param req 
   * @param res 
   */
  async sucursal(req: Request, res: Response){
    const id = req.params.id
    const options = {
      path: `/stores/${id}`,
    };
    try {
      const data = await mp_httpClient(options);
      res.json(data);
    } catch (error) {
      res.json(error);
    }
  }
  /**
   * 
   * curl -X POST \
      'https://api.mercadopago.com/users/{user_id}/stores' \
      -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
      -H 'Content-Type: application/json' \ 
      -d '{
            "name": "Sucursal Instore",
            "business_hours": {
              "monday": [
                {
                  "open": "08:00",
                  "close": "12:00"
                }
              ],
              "tuesday": [
                {
                  "open": "09:00",
                  "close": "18:00"
                }
              ]
            },
            "external_id": "SUC001",
            "location": {
            "street_number": 3039,
            "street_name": "Caseros",
            "city_name": "Belgrano",
            "state_name": "Capital Federal",
            "latitude": -32.8897322,
            "longitude": -68.8443275,
            "reference": "3er Piso"
          }
        }'
   * @param req 
   * @param res 
   */
  async add(req: Request, res: Response){
    const body = Object.assign({},req.body,req.query,req.params);
    const _length = JSON.stringify(body).length
    const options = {
      path: `/users/${config.mp.userID}/stores`,
      json: true,
      method: 'POST',
      body: body,
      headers: {
        'Content-Length': `${_length}`
      }
    }
    try {
      const data = await mp_httpClient(options);
      res.json(data);
    } catch (error) {
      res.json(error);
    }

  }
  /**
   * curl -X PUT \
      'https://api.mercadopago.com/users/{user_id}/stores/{id}' \
      -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
      -H 'Content-Type: application/json' \ 
      -d '{
            "name": "Sucursal Instore 2",
            "business_hours": {
              "monday": [
              {
                "open": "08:00",
                "close": "12:00"
              }],
              "tuesday": [
              {
                "open": "09:00",
                "close": "18:00"
              }]
            },
            "external_id": "SUC002",
            "location": {
              "street_number": 3040,
              "street_name": "Caseros",
              "city_name": "Belgrano",
              "state_name": "Capital Federal",
              "latitude": -32.8897322,
              "longitude": -68.8443275,
              "reference": "3er Piso"
            }
          }'
   * @param req 
   * @param res 
   */
  async update(req: Request, res: Response){
    const params = Object.assign({},req.body,req.query,req.params);
    const options = {
      path: `/users/${config.mp.userID}/stores/${params.id}`,
      method: 'PUT',
    }
    try {
      const data = await mp_httpClient(options);
      res.json(data);
    } catch (error) {
      res.json(error);
    }
  }
  /**
   * curl -X DELETE \
      'https://api.mercadopago.com/users/{user_id}/stores/{id}' \
      -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' 
   * @param req 
   * @param res 
   */
  async borrar(req: Request, res: Response){
  }
}
export const SucursalesCtrl = new SucursalesControler();
    