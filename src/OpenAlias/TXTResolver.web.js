'use strict'

const request = require('xhr')
const OpenAlias = require('@bdxi/beldex-openalias')

//TODO: instead of having the TXTRecords function, use instance of OpenAlias instead
class TXTResolver {
  //
  // Accessors
  TXTRecords (
    name,
    fn // (err, records, dnssec_used, secured, dnssec_fail_reason) -> Void
  ) {
    const completeURL = 'https://cloudflare-dns.com/dns-query?name=' + encodeURIComponent(name) + '&type=TXT'

    const requestHandle = request({
      uri: completeURL,
      headers: {
        "accept": "application/dns-json"
      }
    }, function (err, response, body) {
        if (err) {
          fn(err)
          return
        }
        let json
        try {
          json = JSON.parse(body)
        } catch (e) {
          fn(e.toString())
          return
        }
        const answerEntries = json.Answer
        if (!answerEntries || typeof answerEntries === 'undefined') {
          fn('Unrecognized DNS response')
          return
        }
        const records = []
        for (const answerEntry of answerEntries) {
          let entryData = answerEntry.data
          if (!entryData || typeof entryData === 'undefined') {
            fn('Unrecognized DNS response entry format')
            return
          }
          // remove wrapping escaped "s
          if (entryData.charAt(0) == '"') { // remove
            entryData = entryData.substring(1)
          }
          if (entryData.charAt(entryData.length - 1) == '"') {
            entryData = entryData.slice(0, entryData.length - 1) // remove last char
          }
          records.push(entryData)
        }
        fn(null, records, false, false, null) // TODO: add DNSSEC support
      }
    )
    return requestHandle
  }
}
module.exports = TXTResolver
