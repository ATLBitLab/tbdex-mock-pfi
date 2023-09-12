import type { OfferingsApi } from '@tbdex/http-server'

import { Offering } from '@tbdex/http-server'
import { Mysql } from './mysql.js'

export class _OfferingRepository implements OfferingsApi {

  async create(offering: Offering) {
    let result = await Mysql.client.insertInto('Offering')
      .values({
        offeringId: offering.id,
        baseCurrency: offering.baseCurrency.currencyCode,
        quoteCurrency: offering.quoteCurrency.currencyCode,
        offering: JSON.stringify(offering)
      })
      .execute()

    console.log(`create offering result: ${JSON.stringify(result, null, 2)}`)
  }

  async getOffering(opts: {id: string}): Promise<Offering> {
    const [ result ] =  await Mysql.client.selectFrom('Offering')
      .select(['offering'])
      .where('offeringId', '=', opts.id)
      .execute()

    if (!result) {
      return undefined
    }

    return Offering.factory(result.offering)

  }

  async getOfferings(): Promise<Offering[]> {
    const results =  await Mysql.client.selectFrom('Offering')
      .select(['offering'])
      .execute()

    const offerings: Offering[] = []
    for (let result of results) {
      const offering = Offering.factory(result.offering)
      offerings.push(offering)
    }

    return offerings
  }
}

export const OfferingRepository = new _OfferingRepository()