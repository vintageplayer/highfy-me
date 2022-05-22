import { BigInt } from "@graphprotocol/graph-ts"
import { AccountCreated, mailSent } from "../generated/Mail/Mail"
// import { ExampleEntity } from "../generated/schema"
import { Account, MailItem, ReceiverLabel } from "./schema"

export function handleAccountCreated(event: AccountCreated): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let accountEntity = Account.load(event.params.accountAddress.toHex());

  if (!accountEntity) {
    let accountEntity = new Account(event.params.accountAddress.toHex());

    // Entity fields can be set based on event parameters
    accountEntity.accountAddress = event.params.accountAddress;
    accountEntity.keyCID = event.params.dataCID;
    // accountEntity.credits = BigInt(0) + BigInt(0);
    // Entities can be written to the store with `.save()`
    accountEntity.save();
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

export function generateRelation(from: Account , to: Account, label: string): ReceiverLabel {
  const receiverId = to.get('id')!;
  const senderId = from.get('id')!;

  const relationId = `${receiverId}_${senderId}`;
  let relationEntity = new ReceiverLabel(relationId);
  relationEntity.from = from;
  relationEntity.to = to;
  relationEntity.mailLabel = label;
  relationEntity.save();

  return relationEntity;
}
export function getReceiverLabel(from: Account , to: Account): string {
  const receiverId = to.get('id')!;
  const senderId = from.get('id')!;

  const senderRelationId = `${senderId}_${receiverId}`;
  let senderRelationEntity = ReceiverLabel.load(senderRelationId);
  if (!senderRelationEntity) {
    generateRelation(to, from, "INBOX");
  } else if (senderRelationEntity.get('mailLabel')!.toString() === 'SPAM') {
    senderRelationEntity.mailLabel = "INBOX"
  }

  const receiverRelationId = `${receiverId}_${senderId}`;
  let receiverRelationEntity = ReceiverLabel.load(receiverRelationId);
  if (!receiverRelationEntity) {
    receiverRelationEntity = generateRelation(from, to, "SPAM");
  }
  return receiverRelationEntity.get("mailLabel")!.toString();
}

export function handlemailSent(event: mailSent): void {
  let email = MailItem.load(event.params.dataCID);
  let from = Account.load(event.params.from.toHex());
  let to = Account.load(event.params.to.toHex());

<<<<<<< HEAD
  if (!email && from && to) {
=======
  if (!email && from && to) {    
>>>>>>> 7f6b7b12ffa760d5fd1d7b62cac1f2d4ef8184fc
    let mailEntity = new MailItem(event.params.dataCID);
    mailEntity.from = Account.load(event.params.from.toHex())!;
    mailEntity.to = Account.load(event.params.to.toHex())!;
    mailEntity.dataCID = event.params.dataCID;
<<<<<<< HEAD
=======
    mailEntity.receiverLabel = getReceiverLabel(from, to);
>>>>>>> 7f6b7b12ffa760d5fd1d7b62cac1f2d4ef8184fc
    mailEntity.save();
  }
}
