import { DB } from "../db/firebase";
class Account {
  constructor(props) {
    this.readFromMap(props);
  }

  readFromMap(props) {
    this.id = props.id;
    this.displayName = props.displayName;
    this.email = props.email;
    this.group = props.group;
    this.registered = props.registered;
    this.residence = props.residence;
    this.role = props.role;
    this.status = props.status;
    this.is_admin = props.role === "Admin";
    this.is_active = props.status == "Active";
    this.dbUrl = "/accounts/" + this.id;
  }

  async save() {
	let res = {};
	if(this.displayName) res.displayName = this.displayName;
	if(this.email) res.email = this.email;
	if(this.group) res.group = this.group;
	if(this.registered) res.registered = this.registered;
	if(this.residence) res.residence = this.residence;
	if(this.role) res.role = this.role;
	if(this.status) res.status = this.status;
    await DB.setByUrl(this.dbUrl, res);
  }

  async fetch() {
    this.readFromMap(await DB.getByUrl(this.dbUrl));
  }
}
export default Account;
