const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
  env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:64297';

const PROXY_CONFIG = [
  {
    context: [
      "/weatherforecast",

      "/event/clientid",
      "/event/all",
      "/event/clear",

      "/character/viewmodel",
      "/character/generate",
      "/character/leadership/generate",
      "/character/cohort/generate",
      "/character/follower/generate",
      "/character/randomizers/validate"
    ],
    proxyTimeout: 60000,
    target: target,
    secure: false,
    headers: {
      Connection: 'Keep-Alive'
    }
  }
]

module.exports = PROXY_CONFIG;
