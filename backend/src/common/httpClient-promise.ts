import https from 'https';

export const httpClient = async function (options): Promise<any> {
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

/**
 * usage
 *  async function get_page() {
      const url = 'https://example.com'
      const data = await requestPromise({url, method:'GET'})
      do_awesome_things_with_data(data)
    }
 */
export const requestPromise = ((urlOptions): Promise<any> => {
  let data='';
  return new Promise((resolve, reject) => {
    const req = https.request(urlOptions,
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk.toString()));
        res.on('error', reject);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode <= 299) {
            resolve({statusCode: res.statusCode, headers: res.headers, body: body});
          } else {
            reject('Request failed. status: ' + res.statusCode + ', body: ' + body);
          }
        });
      });
    req.on('error', reject);
    req.write(data, 'binary');
    req.end();
  });
});


