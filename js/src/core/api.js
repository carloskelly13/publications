import superagent from 'superagent';

const basePath = 'http://api.publicationsapp.com';

export default class Api {

  static get(options) {
    let path = `${basePath}${options.path}`;
    Api.performRequest(superagent.get(path), options);
  }

  static post(options) {
    let path = `${basePath}${options.path}`;
    Api.performRequest(superagent.post(path), options);
  }

  static put(options) {
    let path = `${basePath}${options.path}`;
    Api.performRequest(superagent.put(path), options);
  }

  static del(options) {
    let path = `${basePath}${options.path}`;
    Api.performRequest(superagent.del(path), options);
  }

  static performRequest(request, options) {
    request.set('Accept', 'application/json');
    let token = sessionStorage.getItem('access-token');

    if (options.data) { request.send(options.data); }
    if (!!token) { request.set('Authorization', 'Bearer ' + token); }

    request.end((error, response) => {
      if (error) { options.failure(error); }
      else { options.success(response.body); }
    });
  }
}
