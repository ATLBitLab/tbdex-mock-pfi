import { TbdexHttpClient, DevTools, Rfq } from '@tbdex/http-server'

const PFI_DADDIO = 'did:ion:EiA6QLjnvJvq7KzXD-C-x0ZMawXogUaotafJtJpHUP08Lw:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJkd24tc2lnIiwicHVibGljS2V5SndrIjp7ImNydiI6IkVkMjU1MTkiLCJrdHkiOiJPS1AiLCJ4IjoiTlNfTTNTMi1sMkdnSGdfRW1iYV9RRzF6bkhHOTRnN18zZnNYYk01bTdiRSJ9LCJwdXJwb3NlcyI6WyJhdXRoZW50aWNhdGlvbiJdLCJ0eXBlIjoiSnNvbldlYktleTIwMjAifV0sInNlcnZpY2VzIjpbeyJpZCI6InBmaSIsInNlcnZpY2VFbmRwb2ludCI6Imh0dHA6Ly9sb2NhbGhvc3Q6OTAwMCIsInR5cGUiOiJQRkkifV19fV0sInVwZGF0ZUNvbW1pdG1lbnQiOiJFaUFzVmd0Y2JPNkFvS2Y3TzdJREF1TG5SRHFzOE5YLWtYa3RROHhNd2xGMjVRIn0sInN1ZmZpeERhdGEiOnsiZGVsdGFIYXNoIjoiRWlBVGFPUUlJSTFnNnFxNFRuWF8zNlZoSVE2MEdQQ184T1o3bGw1Z0lDWG55dyIsInJlY292ZXJ5Q29tbWl0bWVudCI6IkVpQ1BEaEV6REY1U24xTUNJWEcyU3pyQkNzSnJmUVNFaXUtOFZwZ2VacXhKVkEifX0'

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


const exchanges = await TbdexHttpClient.getExchanges({
  pfiDid: PFI_DADDIO,
  filter: { exchangeId: rfq.exchangeId },
  privateKeyJwk,
  kid
})

console.log('exchanges', JSON.stringify(exchanges, null, 2))