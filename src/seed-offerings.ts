import './polyfills.js'

import { Mysql, OfferingRepository } from './db/index.js'
import { Offering } from '@tbdex/http-server'
import { config } from './config.js'

await Mysql.connect()
await Mysql.ping()
await Mysql.clear()

const offering = Offering.create({
  metadata: { from: config.did.id },
  data: {
    description  : 'Selling BTC for USD',
    baseCurrency : {
      currencyCode : 'BTC',
      maxSubunits  : '99952611'
    },
    quoteCurrency: {
      currencyCode: 'USD'
    },
    quoteUnitsPerBaseUnit : '26043.40',
    payinMethods          : [{
      kind                   : 'DEBIT_CARD',
      requiredPaymentDetails : {
        $schema    : 'http://json-schema.org/draft-07/schema',
        type       : 'object',
        properties : {
          cardNumber: {
            type        : 'string',
            description : 'The 16-digit debit card number',
            minLength   : 16,
            maxLength   : 16
          },
          expiryDate: {
            type        : 'string',
            description : 'The expiry date of the card in MM/YY format',
            pattern     : '^(0[1-9]|1[0-2])\\/([0-9]{2})$'
          },
          cardHolderName: {
            type        : 'string',
            description : 'Name of the cardholder as it appears on the card'
          },
          cvv: {
            type        : 'string',
            description : 'The 3-digit CVV code',
            minLength   : 3,
            maxLength   : 3
          }
        },
        required             : ['cardNumber', 'expiryDate', 'cardHolderName', 'cvv'],
        additionalProperties : false
      }
    }],
    payoutMethods: [{
      kind                   : 'BTC_ADDRESS',
      requiredPaymentDetails : {
        $schema    : 'http://json-schema.org/draft-07/schema',
        type       : 'object',
        properties : {
          btcAddress: {
            type        : 'string',
            description : 'your Bitcoin wallet address'
          }
        },
        required             : ['btcAddress'],
        additionalProperties : false
      }
    }],
    requiredClaims: {
      id                : '7ce4004c-3c38-4853-968b-e411bafcd945',
      input_descriptors : [{
        id          : 'bbdb9b7c-5754-4f46-b63b-590bada959e0',
        constraints : {
          fields: [{
            path   : ['$.type'],
            filter : {
              type  : 'string',
              const : 'YoloCredential'
            }
          }]
        }
      }]
    }
  }
})

await offering.sign(config.did.privateKey, `${config.did.id}#${config.did.kid}`)
await OfferingRepository.create(offering)