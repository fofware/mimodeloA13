import https from 'https';
import config from '../config';
const token = config.mp.mode === 'prod' ? config.mp.prod.accessToken : config.mp.dev.accessToken;

export const mp_httpClient = async function (opt:any) {
  const def_options = {
    host: 'api.mercadopago.com',
    method: 'GET',
    port: 443,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json; charset=UTF-8'
    }
  };
  const options = Object.assign({},def_options,opt);
  return new Promise((resolve, reject) => {
    const ret = https.request(options, ret =>{
      let rpta:any = {};
      let data = ""
      if (ret.statusCode !== 200) {
        const error = { from: `${options.host}${options.path}`, code: ret.statusCode, message: ret.statusMessage };
        console.log(error);
        ret.resume();
        reject(error)
      } else {
        ret.setEncoding('utf8');
        rpta['status'] = ret.statusCode;
        rpta['statusMessage'] = ret.statusMessage;
        //rpta['headers'] = ret.headers;
        rpta['from'] = `${options.host}${options.path}`
        ret.on('close', () => {
          const result = JSON.parse(data);
          //console.log(data)
          rpta['data'] = result;
          resolve(rpta)
        });
        ret.on('data', chunk => {
          data += chunk;
        });
      }
    });
    ret.end()
  });
}

export const mp_makeUri = function (def_params:any,query:any,body:any): string{
  const params = Object.assign(def_params,query,body);
  let qry = '';
  let sep = '?'
  for (const key in def_params) {
    if (Object.prototype.hasOwnProperty.call(def_params, key)) {
      const e = params[key];
      if(e){
        qry += `${sep}${key}=${e}`;
        sep = "&";
      }
    }
  }
  qry = encodeURI(qry);
  return qry;
}
