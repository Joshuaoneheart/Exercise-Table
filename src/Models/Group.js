class Group {
  constructor(id = "", account_list = []) {
    this.id = id;
    this.list = account_list;
  }
  
  pushAccount(account) {
    this.list.push(account);
  }

  get length() {
    return this.list.length;
  }

  getAccount(i){
    return this.list[i];
  }
}

export default Group;
