import https from 'https';

export const httpClient = async function (options) {
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
