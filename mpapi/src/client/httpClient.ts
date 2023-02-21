import https from 'https';


export const httpClient = async function (options:any) {
  return new Promise((resolve, reject) => {
    let data:any = "";
    const req = https.request(options, (res) => {
      console.log('statusCode:', res.statusCode);
      console.log('headers:', res.headers);
      res.setEncoding('utf8');
      res.on('data', (d) => {
        data += d;
      });
    });
    req.on('error', (e) => {
      console.error(e);
    });
    resolve(data)
    req.end();
  });
}
  
export const httpClient1 = async function (options:any) {
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
//        rpta['status'] = ret.statusCode;
//        rpta['statusMessage'] = ret.statusMessage;
//        //rpta['headers'] = ret.headers;
//        rpta['from'] = `${options.host}${options.path}`
        ret.on('close', () => {
//          const result = JSON.parse(data);
          //console.log(data)
//          rpta['data'] = result;
          resolve(data)
        });
        ret.on('data', chunk => {
          data += chunk;
        });
      }
    });
    ret.end()
  });
}
