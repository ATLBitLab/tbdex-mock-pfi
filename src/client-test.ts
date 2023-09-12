import { TbdexHttpClient, DevTools, Rfq } from '@tbdex/http-server'

const PFI_DADDIO = 'did:ion:EiDcnE3zZGD9K11tS9TBQVCdIsDPDQNn1NnJhhBPsfx32Q:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJkd24tc2lnIiwicHVibGljS2V5SndrIjp7ImNydiI6IkVkMjU1MTkiLCJrdHkiOiJPS1AiLCJ4IjoiQWl3dEdDSndORjM1T3lYOTBhQW9nOWRlMWZKZHpoYkd0OTJVZDE3MDBnUSJ9LCJwdXJwb3NlcyI6WyJhdXRoZW50aWNhdGlvbiJdLCJ0eXBlIjoiSnNvbldlYktleTIwMjAifV0sInNlcnZpY2VzIjpbeyJpZCI6InBmaSIsInNlcnZpY2VFbmRwb2ludCI6Imh0dHA6Ly9sb2NhbGhvc3Q6OTAwMCIsInR5cGUiOiJQRkkifV19fV0sInVwZGF0ZUNvbW1pdG1lbnQiOiJFaUI4bThIY2tSOHlObFRqcG9DZ2M3OXkxR3ZOc0tfN3VkSDVMMUVnT3pYMzNRIn0sInN1ZmZpeERhdGEiOnsiZGVsdGFIYXNoIjoiRWlCNjBUVjM0Y0x0QU1Vd0M4aU8wWTJRRWRGWHJRWmxPc2FRSkFxS2N6b1BCZyIsInJlY292ZXJ5Q29tbWl0bWVudCI6IkVpQVo0bjJpQjQ5TzJRNERhTVNDR3ZxcTRaM2NkeGtSclBoZ2RzNW1DWktxencifX0'

const { data } = await TbdexHttpClient.getOfferings({ pfiDid: PFI_DADDIO })
const [ offering ] = data

console.log('offering', JSON.stringify(offering, null, 2))

const alice = await DevTools.createDid()
const { privateKeyJwk } = alice.keySet.verificationMethodKeys[0]
const kid = alice.document.verificationMethod[0].id

const { signedCredential } = await DevTools.createCredential({
  type    : 'YoloCredential',
  issuer  : alice,
  subject : alice.did,
  data    : {
    'beep': 'boop'
  }
})

const rfq = Rfq.create({
  metadata: { from: alice.did, to: PFI_DADDIO },
  data: {
    offeringId: offering.id,
    quoteAmountSubunits: '100',
    payinMethod: {
      kind: 'DEBIT_CARD',
      paymentDetails: {
        cvv: '123',
        cardNumber: '1234567890123456789',
        expiryDate: '10/23',
        cardHolderName: 'Ephraim Mcgilacutti'
      }
    },
    payoutMethod: {
      kind: 'BTC_ADDRESS',
      paymentDetails: {
        btcAddress: '0x1234567890'
      }
    },
    claims: [signedCredential]
  }
})

await rfq.sign(privateKeyJwk, kid)

const rasp = await TbdexHttpClient.sendMessage({ message: rfq })
console.log('send rfq response', JSON.stringify(rasp, null, 2))


privateKeyJwk['kid'] = kid
const exchanges = await TbdexHttpClient.getExchanges({
  pfiDid: PFI_DADDIO,
  filter: { exchangeId: [rfq.exchangeId, 'omghai'] },
  privateKeyJwk,
  kid
})

console.log('exchanges', JSON.stringify(exchanges, null, 2))