import { Collection, Entity, Index, ManyToMany, ManyToOne, OneToOne, Property } from '@mikro-orm/core'
import { ARBITRUM_CONTRACTS, IPositionClose, IPosition, IPositionDecrease, IPositionIncrease, IPositionLiquidated, IPositionUpdate } from 'gambit-middleware'
import { BaseEntity } from './BaseEntity'
import { NativeBigIntType } from './utils'


export abstract class PositionIdentifier extends BaseEntity {
  @Property() key: string

  constructor(key: string) {
    super()
    this.key = key
  }
}
export abstract class Position extends PositionIdentifier implements IPosition {
  @Index() @Property() account: string
  @Property() collateralToken: string
  @Property() indexToken: ARBITRUM_CONTRACTS
  @Property() isLong: boolean

  constructor(account: string, isLong: boolean, indexToken: ARBITRUM_CONTRACTS, collateralToken: string, ...pos: ConstructorParameters<typeof PositionIdentifier>) {
    super(...pos)
    this.account = account
    this.isLong = isLong
    this.indexToken = indexToken
    this.collateralToken = collateralToken
  }
}





export abstract class PositionMake extends Position implements IPosition {
  @Property({ type: NativeBigIntType }) collateralDelta: bigint
  @Property({ type: NativeBigIntType }) price: bigint
  @Property({ type: NativeBigIntType }) sizeDelta: bigint
  @Property({ type: NativeBigIntType }) fee: bigint

  constructor(price: bigint, collateralDelta: bigint, sizeDelta: bigint, fee: bigint, ...pos: ConstructorParameters<typeof Position>) {
    super(...pos)
    this.price = price
    this.fee = fee
    this.collateralDelta = collateralDelta
    this.sizeDelta = sizeDelta
  }
}

export abstract class AbstractPositionUpdate extends PositionIdentifier {
  @Property({ type: NativeBigIntType }) reserveAmount: bigint
  @Property({ type: NativeBigIntType }) realisedPnl: bigint
  @Property({ type: NativeBigIntType }) collateral: bigint
  @Property({ type: NativeBigIntType }) size: bigint
  @Property({ type: NativeBigIntType }) averagePrice: bigint
  @Property({ type: NativeBigIntType }) entryFundingRate: bigint

  constructor(averagePrice: bigint, entryFundingRate: bigint, reserveAmount: bigint, realisedPnl: bigint, collateral: bigint, size: bigint, ...pos: ConstructorParameters<typeof PositionIdentifier>) {
    super(...pos)
    this.reserveAmount = reserveAmount
    this.realisedPnl = realisedPnl
    this.collateral = collateral
    this.size = size
    this.averagePrice = averagePrice
    this.entryFundingRate = entryFundingRate
  }
}1


@Entity()
export class PositionIncrease extends PositionMake implements IPositionIncrease {
}

@Entity()
export class PositionDecrease extends PositionMake implements IPositionDecrease {
}

@Entity()
export class PositionUpdate extends AbstractPositionUpdate implements IPositionUpdate {
}

@Entity()
export class PositionClose extends AbstractPositionUpdate implements IPositionClose {
}

@Entity()
export class PositionLiquidated extends Position implements IPositionLiquidated {
  @Property({ type: NativeBigIntType }) markPrice: bigint;
  @Property({ type: NativeBigIntType }) reserveAmount: bigint
  @Property({ type: NativeBigIntType }) realisedPnl: bigint
  @Property({ type: NativeBigIntType }) collateral: bigint
  @Property({ type: NativeBigIntType }) size: bigint

  constructor(reserveAmount: bigint, realisedPnl: bigint, collateral: bigint, size: bigint, markPrice: bigint, ...pos: ConstructorParameters<typeof Position>) {
    super(...pos)

    this.reserveAmount = reserveAmount
    this.realisedPnl = realisedPnl
    this.collateral = collateral
    this.size = size
    this.markPrice = markPrice
  }
}


@Entity()
export class AggregatedTrade extends Position {
  @ManyToOne(() => PositionIncrease) initialPosition: PositionIncrease

  @ManyToMany(() => PositionIncrease) increases = new Collection<PositionIncrease>(this)
  @ManyToMany(() => PositionDecrease) decreases = new Collection<PositionDecrease>(this)
  @ManyToMany(() => PositionUpdate) updates = new Collection<PositionUpdate>(this)

  constructor(initIncrease: PositionIncrease) {
    super(initIncrease.account, initIncrease.isLong, initIncrease.indexToken, initIncrease.collateralToken, initIncrease.key)

    this.initialPosition = initIncrease
    this.createdAt = initIncrease.createdAt
    this.increases.add(initIncrease)
  }
}

@Entity()
export class AggregatedTradeSettled extends AggregatedTrade {
  @ManyToOne(() => PositionClose || PositionLiquidated) settlement: PositionClose | PositionLiquidated
  @Property() settledDate: Date;

  constructor(settlement: PositionClose | PositionLiquidated, aggTrade: AggregatedTrade) {
    super(aggTrade.initialPosition)


    this.increases.set(aggTrade.increases.getItems())
    this.decreases.set(aggTrade.decreases.getItems())
    this.updates.set(aggTrade.updates.getItems())

    this.settledDate = settlement.createdAt
    this.settlement = settlement
  }
}
