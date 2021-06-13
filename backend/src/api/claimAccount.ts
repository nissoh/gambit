import Router from 'express-promise-router'

import { EM } from '../server'
import { BSC_WALLET, hex2asc, TX_HASH_REGEX } from 'gambit-middleware'
import { bscNini } from '../rpc'
import { Claim } from '../dto/Account'
import { wrap } from '@mikro-orm/core'


export const claimApi = Router()


claimApi.get('/claim-list', async (req, res) => {
  const claimList = await EM.find(Claim, {})

  res.send(claimList)
})

claimApi.post<string>('/claim-account', async (req, res) => {
  const tx = req.body?.tx
  const isValidTx = TX_HASH_REGEX.test(tx)

  if (isValidTx === false) {
    return res.status(403).json({ message: 'Invalid transaction' })
  }

  const txRecpt = await bscNini.getTransaction(tx)

  if (txRecpt.to !== BSC_WALLET.Gambit_Claim) {
    return res.status(403).json({ message: 'Invalid transaction' })
  }

  let currentClaim = await EM.findOne(Claim, {
    address: { $eq: txRecpt.from },
  })

  if (!txRecpt.blockNumber) {
    return res.status(403).json({ message: 'unable to get tx block number' })
  }

  if (currentClaim === null) {
    const identity = hex2asc(txRecpt.data).substr(3)

    currentClaim = new Claim(txRecpt.from, identity, txRecpt.blockNumber)
    await EM.persist(currentClaim).flush()

    return res.json(currentClaim)
  }


  if (currentClaim && currentClaim.latestClaimBlockNumber > txRecpt.blockNumber  ) {
    return res.status(403).json({ message: 'Already claimed by a previous block' })
  }

  const identity = hex2asc(txRecpt.data).substr(3)

  wrap(currentClaim).assign({ identity, latestClaimBlockNumber: txRecpt.blockNumber })

  await EM.flush()

  res.json(currentClaim)

})

