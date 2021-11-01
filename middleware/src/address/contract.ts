

export enum ARBITRUM_TRADEABLE_ADDRESS {
  WETH = "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
  WBTC = "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f",
  LINK = "0xf97f4df75117a78c1a5a0dbb814af92458539fb4",
  UNI = "0xfa7f8980b0f1e64a2062791cc3b0871572f1f7f0",
}

// TOKEN_SYMBOL.ETH | TOKEN_SYMBOL.BTC | TOKEN_SYMBOL.UNI | TOKEN_SYMBOL.LINK

export enum ARBITRUM_ADDRESS {
  Vault = "0x489ee077994B6658eAfA855C308275EAd8097C4A",
  Router = "0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064",
  Reader = "0xbD8F00AabeC361ce52486431433FB196c53C5101",
  GlpManager = "0x321F653eED006AD1C29D174e17d96351BDe22649",
  RewardRouter = "0xc73d553473dC65CE56db96c58e6a091c20980fbA",

  RewardReader = "0xD6cf2885cdF53868127F0aBefa1CEE40B940FC8f",
  NATIVE_TOKEN = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",

  GLP = "0x4277f8F2c384827B5273592FF7CeBd9f2C1ac258",
  GMX = "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
  ES_GMX = "0xf42Ae1D54fd613C9bb14810b0588FaAa09a426cA",
  BN_GMX = "0x35247165119B69A40edD5304969560D0ef486921",
  USDG = "0x45096e7aA921f27590f8F19e457794EB09678141",
  StakedGmxTracker = "0x908C4D94D34924765f1eDc22A1DD098397c59dD4",
  BonusGmxTracker = "0x4d268a7d4C16ceB5a606c173Bd974984343fea13",
  FeeGmxTracker = "0xd2D1162512F927a7e282Ef43a362659E4F2a728F",
  
  StakedGlpTracker = "0x1aDDD80E6039594eE970E5872D247bf0414C8903",
  FeeGlpTracker = "0x4e971a87900b931fF39d1Aad67697F49835400b6",

  StakedGmxDistributor = "0x23208B91A98c7C1CD9FE63085BFf68311494F193",
  StakedGlpDistributor = "0x60519b48ec4183a61ca2B8e37869E675FD203b34",

  // placeholder addresses
  OrderBook = "0x84B1FEA4A2c1e0C07f34755ac4cf5aD26a07485d",
  OrderBookReader = "0x9Ed8Aea78D6Af0D4089f4D24066b8EFdA59747D9",

  // Tokens

  ETH = "0x0000000000000000000000000000000000000000",


  USDC = "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
  USDT = "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
}


const tradableAdressToNameMap = Object.entries(ARBITRUM_TRADEABLE_ADDRESS).reduce((seed, [name, address]) => {
  return { ...seed, [address]: name }
}, {} as {[key: string]: string})


export function indexTokenToName(address: ARBITRUM_TRADEABLE_ADDRESS): string {
  const name = tradableAdressToNameMap[address]

  if (!name) {
    throw new Error('No index token matched this address')
  }
  return name
}
    
    
  
