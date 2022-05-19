import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Account extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Account entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Account must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Account", id.toString(), this);
    }
  }

  static load(id: string): Account | null {
    return changetype<Account | null>(store.get("Account", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get accountAddress(): Bytes {
    let value = this.get("accountAddress");
    return value!.toBytes();
  }

  set accountAddress(value: Bytes) {
    this.set("accountAddress", Value.fromBytes(value));
  }

  get keyCID(): string {
    let value = this.get("keyCID");
    return value!.toString();
  }

  set keyCID(value: string) {
    this.set("keyCID", Value.fromString(value));
  }

  get credits(): BigInt {
    let value = this.get("credits");
    return value!.toBigInt();
  }

  set credits(value: BigInt) {
    this.set("credits", Value.fromBigInt(value));
  }
}

export class MailItem extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save MailItem entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type MailItem must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("MailItem", id.toString(), this);
    }
  }

  static load(id: string): MailItem | null {
    return changetype<MailItem | null>(store.get("MailItem", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get from(): Account {
    return Account.load(this.get("from"));
  }

  set from(value: Account) {
    this.set("from", value.get('id')!);
  }

  get to(): Account {
    return Account.load(this.get("to"));
  }

  set to(value: Account) {
    this.set("to", value.get('id')!);
  }

  get dataCID(): string {
    let value = this.get("dataCID");
    return value!.toString();
  }

  set dataCID(value: string) {
    this.set("dataCID", Value.fromString(value));
  }

  get receiverLabel(): string {
    let value = this.get("receiverLabel");
    return value!.toString();
  }

  set receiverLabel(value: string) {
    this.set("receiverLabel", Value.fromString(value));
  }
}

export class ReceiverLabel extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ReceiverLabel entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type ReceiverLabel must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("ReceiverLabel", id.toString(), this);
    }
  }

  static load(id: string): ReceiverLabel | null {
    return changetype<ReceiverLabel | null>(store.get("ReceiverLabel", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get from(): Account {
    return Account.load(this.get("from"));
  }

  set from(value: Account) {
    this.set("from", value.get('id')!);
  }

  get to(): Account {
    return Account.load(this.get("to"));
  }

  set to(value: Account) {
    this.set("to", value.get('id')!);
  }

  get mailLabel(): string {
    let value = this.get("mailLabel");
    return value!.toString();
  }

  set mailLabel(value: string) {
    this.set("mailLabel", Value.fromString(value));
  }
}