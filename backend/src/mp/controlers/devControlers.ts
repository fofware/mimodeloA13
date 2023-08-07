import { Request, Response, Router } from "express";
import { mp_httpClient, mp_makeUri } from "../mpUtils";
import config from '../../config';
import app from "../../app";

export class devControler {
  public router: Router = Router();
  constructor() {
		this.config();
	}
  config(){
    this.router.get('/mp/mediosdepagos', this.mediosdepagos );
    this.router.get('/mp/tipodedocumentos', this.tipodedocumentos );
    this.router.get('/mp/cajas', this.cajas );
    this.router.get('/mp/caja/:id', this.caja );
    this.router.get('/mp/intencionesdepago', this.intencionesdepago );
    this.router.get('/mp/pagos', this.pagos );
    this.router.get('/mp/devices', this.devices );
    this.router.get('/mp/ordenes', this.ordenes );
  }
  /*
    curl -X GET \
        'https://api.mercadopago.com/v1/payment_methods' \
        -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'   
  */
  async mediosdepagos(req: Request, res: Response){
    const options = {
      host: 'api.mercadopago.com',
      path: `/v1/payment_methods`,
      method: 'GET',
      port: 443,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${config.mp[config.mp.mode].accessToken}`,
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
  /*
    curl -X GET \
      'https://api.mercadopago.com/v1/identification_types' \
      -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' 
  */
  async tipodedocumentos(req: Request, res: Response){
    const options = {
      host: 'api.mercadopago.com',
      path: `/v1/identification_types`,
      method: 'GET',
      port: 443,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${config.mp[config.mp.mode].accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8'
      }
    };
    try {
      const io = app.get('sio')
      const data = await mp_httpClient(options);
      io.emit('mptipodoc', data);
      res.json(data);
    } catch (error) {
      res.json(error);
    }
  }
  /*
    curl -X GET \
    'https://api.mercadopago.com/pos?external_id=SUC001POS001&external_store_id=undefined&store_id=undefined&category=undefined' \
    -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' 
  */
  async cajas(req: Request, res: Response){
    const def_params = {
      external_id: null,
      external_store_id: null,
      store_id: null,
      category: null
    }
    const qry = mp_makeUri(def_params,req.query,req.body);
    const options = {
      host: 'api.mercadopago.com',
      path: `/pos/${qry}`,
      method: 'GET',
      port: 443,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${config.mp[config.mp.mode].accessToken}`,
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
  /*
    curl -X GET \
      'https://api.mercadopago.com/pos/{id}' \
      -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'       
  */
   async caja(req: Request, res: Response){
     const options = {
       host: 'api.mercadopago.com',
       path: `/pos/${req.params.id}`,
       method: 'GET',
       port: 443,
       headers: {
         'Accept': 'application/json',
         'Authorization': `Bearer ${config.mp[config.mp.mode].accessToken}`,
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
    
  /*
    curl -X GET \
      'https://api.mercadopago.com/point/integration-api/payment-intents/events?startDate=1948-01-16&endDate=2022-01-25' \
      -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'   */
  async intencionesdepago(req: Request, res: Response){
    const d = new Date().getTime();
    const def_params = {
      limit: 50,
      offset: 0,
      startDate: new Date(d-(30*86400000)).toISOString().substring(0,10),
      endDate: new Date(d).toISOString().substring(0,10)
    }
    const qry = mp_makeUri(def_params,req.query,req.body);

    const options = {

      host: 'api.mercadopago.com',
      path: `/point/integration-api/payment-intents/events${qry}`,
      method: 'GET',
      port: 443,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${config.mp[config.mp.mode].accessToken}`,
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
  /*
  curl -X GET \
    'https://api.mercadopago.com/v1/payments/search?sort=date_created&criteria=desc&external_reference=ID_REF' \
    -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'
  */
  async pagos(req: Request, res: Response){
    const params = Object.assign({
      limit: 30,
      offset: 0,
      sort: 'date_created',
      criteria: 'desc'
    },req.query,req.body);
    let qry = '';
    qry += params.limit ? `?limit=${params.limit}` : '?limit=30';
    qry += params.offset ? `&offset=${params.offset}` : '&offset=0';
    qry += params.sort ? `&sort=${params.sort}` : '&sort=date_created';
    qry += params.criteria ? `&criteria=${params.criteria}` : '&criteria=desc';
    //qry += params.external_reference ? `&extenal_reference${params.external_reference}` : '&external_reference=Venta presencial';
    qry = encodeURI(qry);
    console.log(qry);
    const options = {
      host: 'api.mercadopago.com',
      path: `/v1/payments/search${qry}`,
      method: 'GET',
      port: 443,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${config.mp[config.mp.mode].accessToken}`,
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
  
  /*
    curl -X GET \
        'https://api.mercadopago.com/point/integration-api/devices?store_id=1235456678&pos_id=1235456678&limit=50&offset=0' \
        -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' 
  */
  async devices(req: Request, res: Response){
    const user_ID = '84242924';
    const options = {
      host: 'api.mercadopago.com',
      path: `/point/integration-api/devices`,
      method: 'GET',
      port: 443,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${config.mp[config.mp.mode].accessToken}`,
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
  /*
  curl -X GET \
    'https://api.mercadopago.com/merchant_orders/search?status=12123adfasdf123u4u&preference_id=12123adfasdf123u4u&application_id=12123adfasdf123u4u&payer_id=12123adfasdf123u4u&sponsor_id=12123adfasdf123u4u&external_reference=12123adfasdf123u4u&site_id=12123adfasdf123u4u&marketplace=12123adfasdf123u4u&date_created_from=12123adfasdf123u4u&date_created_to=12123adfasdf123u4u&last_updated_from=12123adfasdf123u4u&last_updated_to=12123adfasdf123u4u&items=12123adfasdf123u4u&limit=12123adfasdf123u4u&offset=12123adfasdf123u4u' \
    -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'
  */
  async ordenes(req: Request, res: Response){
    const def_params = {
      limit: 50,
      offset: 0,
      status: null,
      preference_id: null,
      aplication_id: null,
      payer_id: null,
      external_reference: null,
      site_id: null,
      marquetplace: null,
      date_created_from: null,
      date_created_to: null,
      last_updated_from: null,
      last_updated_to: null,
      items: null,
    }
    const qry = mp_makeUri(def_params,req.query,req.body);
    const options = {
      host: 'api.mercadopago.com',
      path: `https://api.mercadopago.com/merchant_orders/search${qry}`,
      method: 'GET',
      port: 443,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${config.mp[config.mp.mode].accessToken}`,
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
}

export const devCtrl = new devControler();
