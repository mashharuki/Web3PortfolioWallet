import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  DNSCreated,
  OwnershipTransferred,
  Registered,
  Transfer,
  UpdateVc
} from "../generated/DNS/DNS"

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createDNSCreatedEvent(
  name: string,
  symbol: string,
  owner: Address
): DNSCreated {
  let dnsCreatedEvent = changetype<DNSCreated>(newMockEvent())

  dnsCreatedEvent.parameters = new Array()

  dnsCreatedEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  dnsCreatedEvent.parameters.push(
    new ethereum.EventParam("symbol", ethereum.Value.fromString(symbol))
  )
  dnsCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return dnsCreatedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createRegisteredEvent(
  to: Address,
  did: string,
  name: string,
  isRegistered: boolean
): Registered {
  let registeredEvent = changetype<Registered>(newMockEvent())

  registeredEvent.parameters = new Array()

  registeredEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  registeredEvent.parameters.push(
    new ethereum.EventParam("did", ethereum.Value.fromString(did))
  )
  registeredEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  registeredEvent.parameters.push(
    new ethereum.EventParam(
      "isRegistered",
      ethereum.Value.fromBoolean(isRegistered)
    )
  )

  return registeredEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}

export function createUpdateVcEvent(
  did: string,
  name: string,
  cid: string
): UpdateVc {
  let updateVcEvent = changetype<UpdateVc>(newMockEvent())

  updateVcEvent.parameters = new Array()

  updateVcEvent.parameters.push(
    new ethereum.EventParam("did", ethereum.Value.fromString(did))
  )
  updateVcEvent.parameters.push(
    new ethereum.EventParam("name", ethereum.Value.fromString(name))
  )
  updateVcEvent.parameters.push(
    new ethereum.EventParam("cid", ethereum.Value.fromString(cid))
  )

  return updateVcEvent
}
