import { BigInt } from "@graphprotocol/graph-ts"
import { Mail, AccountCreated, mailSent } from "../generated/Mail/Mail"
// import { ExampleEntity } from "../generated/schema"
import { Account, MailItem } from "./schema"

export function handleAccountCreated(event: AccountCreated): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let accountEntity = Account.load(event.transaction.from.toHex());

  if (!accountEntity) {
    let accountEntity = new Account(event.transaction.from.toHex());

    // Entity fields can be set based on event parameters
    accountEntity.accountAddress = event.params.accountAddress
    accountEntity.keyCID = event.params.keyCID

    // Entities can be written to the store with `.save()`
    accountEntity.save()
  }

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // None
}

export function handlemailSent(event: mailSent): void {
  let email = MailItem.load(event.params.dataCID);
  let from = Account.load(event.params.from.toHex());
  let to = Account.load(event.params.to.toHex());

  if (!email && from && to) {
    let mailEntity = new MailItem(event.params.dataCID);
    mailEntity.from = Account.load(event.params.from.toHex())!;
    mailEntity.to = Account.load(event.params.to.toHex())!;
    mailEntity.dataCID = event.params.dataCID;
    mailEntity.save();
  }
}
