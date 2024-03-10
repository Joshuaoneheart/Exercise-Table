import { DB } from "../db/firebase";
class Account {
  constructor(props, is_changed = false) {
    this.readFromMap(props, is_changed);
  }

  readFromMap(props, is_changed) {
    this.id = props.id;
    this.displayName = props.displayName;
    this.email = props.email;
    this.group = props.group;
    this.registered = props.registered;
    this.residence = props.residence;
    this.role = props.role;
    this.status = props.status;
    this.is_admin = props.role === "Admin";
    this.is_active = props.status === "Active";
    this.dbUrl = "/accounts/" + this.id;
    this.is_changed = is_changed;
  }

  update(attribute, value) {
    this[attribute] = value;
    this.is_changed = true;
  }

  async save() {
    let res = {};
    if (this.displayName) res.displayName = this.displayName;
    if (this.email) res.email = this.email;
    if (this.group) res.group = this.group;
    if (this.registered) res.registered = this.registered;
    if (this.residence) res.residence = this.residence;
    if (this.role) res.role = this.role;
    if (this.status) res.status = this.status;
    if (this.is_changed) await DB.setByUrl(this.dbUrl, res);
  }

  async fetch() {
    this.readFromMap(await DB.getByUrl(this.dbUrl));
  }
}
export default Account;
