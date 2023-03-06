import { DB } from "../db/firebase";
class Account {
	constructor(props) {
		this.readFromMap(props);
	}

	readFromMap(props){
		this.id = props.id;
		this.displayName = props.displayName;
		this.email = props.email;
		this.group = props.group;
		this.registered = props.registered;
		this.residence = props.residence;
		this.is_admin = props.role === "Admin";
		this.is_active = props.status == "Active";
		this.dbUrl = "/accounts/" + this.id;
	}	

	save() {

	}

	async fetch() {
		this.readFromMap(await DB.getByUrl(this.dbUrl));
	}
}
export default Account;
