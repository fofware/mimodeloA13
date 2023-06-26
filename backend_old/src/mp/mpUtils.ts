import https from 'https';

export const mp_httpClient = async function (options) {
  return new Promise((resolve, reject) => {
    const ret = https.request(options, ret =>{
      let rpta = {};
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
export const mp_makeUri = function (def_params,query,body): string{
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
