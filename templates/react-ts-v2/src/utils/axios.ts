import axios from 'axios'
import qs from 'qs'

const baseUrl = ''
class HttpRequest {
  baseUrl: string

  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }
  // get request config
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      transformRequest: [
        function (data, config) {
          // 对 data 进行任意转换处理
          if (
            config['Content-Type'] &&
            config['Content-Type'].indexOf('multipart/form-data') > -1
          ) {
            return data
          } else if (
            config['Content-Type'] &&
            config['Content-Type'].indexOf('application/json') > -1
          ) {
            return JSON.stringify(data)
          } else {
            return qs.stringify(data, config)
          }
        },
      ],
    }

    return config
  }

  request(options) {
    const instance = axios.create()

    options = Object.assign(this.getInsideConfig(), options)
    return instance(options)
  }
}
const request = new HttpRequest(baseUrl)

export default request
