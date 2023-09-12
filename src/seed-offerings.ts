import './polyfills.js'

import { Postgres, OfferingRepository } from './db/index.js'
import { Offering } from '@tbdex/http-server'
import { config } from './config.js'

await Postgres.connect()
// await Postgres.ping()
await Postgres.clear()

const offering = Offering.create({
  metadata: { from: config.did.id },
  data: {
    description           : 'fake offering 1',
    quoteUnitsPerBaseUnit : '0.0069', // ex. we send 100 dollars, so that means 14550.00 KES
    baseCurrency          : { currencyCode: 'KES' },
    quoteCurrency         : { currencyCode: 'USD' },
    payinMethods          : [{
      kind                   : 'USD_LEDGER',
      requiredPaymentDetails : { }
    }],
    payoutMethods: [
      {
        kind                   : 'MOMO_MPESA',
        requiredPaymentDetails : {
          '$schema'  : 'http://json-schema.org/draft-07/schema#',
          'title'    : 'Mobile Money Required Payment Details',
          'type'     : 'object',
          'required' : [
            'phoneNumber',
            'reason'
          ],
          'additionalProperties' : false,
          'properties'           : {
            'phoneNumber': {
              'title'       : 'Mobile money phone number',
              'description' : 'Phone number of the Mobile Money account',
              'type'        : 'string'
            },
            'reason': {
              'title'       : 'Reason for sending',
              'description' : 'To abide by the travel rules and financial reporting requirements, the reason for sending money',
              'type'        : 'string'
            }
          }
        }
      },
      {
        kind                   : 'BANK_FIRSTBANK',
        requiredPaymentDetails : {
          '$schema'  : 'http://json-schema.org/draft-07/schema#',
          'title'    : 'Bank Transfer Required Payment Details',
          'type'     : 'object',
          'required' : [
            'accountNumber',
            'reason'
          ],
          'additionalProperties' : false,
          'properties'           : {
            'accountNumber': {
              'title'       : 'Bank account number',
              'description' : 'Bank account of the recipient\'s bank account',
              'type'        : 'string'
            },
            'reason': {
              'title'       : 'Reason for sending',
              'description' : 'To abide by the travel rules and financial reporting requirements, the reason for sending money',
              'type'        : 'string'
            }
          }
        }
      }
    ],
    requiredClaims: {
      id                : '7ce4004c-3c38-4853-968b-e411bafcd945',
      input_descriptors : [{
        id          : 'bbdb9b7c-5754-4f46-b63b-590bada959e0',
        constraints : {
          fields: [{
            path   : ['$.issuer'],
            filter : {
              type  : 'string',
              const : 'did:ion:EiD6Jcwrqb5lFLFWyW59uLizo5lBuChieiqtd0TFN0xsng:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJ6cC1mNnFMTW1EazZCNDFqTFhIXy1kd0xOLW9DS2lTcDJaa19WQ2t4X3ZFIiwicHVibGljS2V5SndrIjp7ImNydiI6InNlY3AyNTZrMSIsImt0eSI6IkVDIiwieCI6IjNmVFk3VXpBaU9VNVpGZ05VVjl3bm5pdEtGQk51RkNPLWxlRXBDVzhHOHMiLCJ5IjoidjJoNlRqTDF0TnYwSDNWb09Fbll0UVBxRHZOVC0wbVdZUUdLTGRSakJ3ayJ9LCJwdXJwb3NlcyI6WyJhdXRoZW50aWNhdGlvbiJdLCJ0eXBlIjoiSnNvbldlYktleTIwMjAifV0sInNlcnZpY2VzIjpbXX19XSwidXBkYXRlQ29tbWl0bWVudCI6IkVpQjk3STI2bmUwdkhXYXduODk1Y1dnVlE0cFF5NmN1OUFlSzV2aW44X3JVeXcifSwic3VmZml4RGF0YSI6eyJkZWx0YUhhc2giOiJFaURqSmlEdm9RekstRl94V05VVzlzMTBUVmlpdEI0Z1JoS09iYlh2S1pwdlNRIiwicmVjb3ZlcnlDb21taXRtZW50IjoiRWlCbEk1NWx6b3JoeE42TVBqUlZtV2ZZY3MxNzNKOFk3S0hTeU5LcmZiTzVfdyJ9fQ'
            }
          }]
        }
      }]
    }
  }
})

await offering.sign(config.did.privateKey, `${config.did.id}#${config.did.kid}`)
await OfferingRepository.create(offering)