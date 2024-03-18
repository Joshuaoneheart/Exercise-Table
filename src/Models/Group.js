class Group {
  constructor(id="", name="", account_list = []) {
    this.id = id;
    this.name = name
    this.list = account_list;
  }
  
  pushAccount(account) {
    this.list.push(account);
  }

  get length() {
    return this.list.length;
  }

  indexOf(id){
    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i].id === id) return i;
    }
    return -1;
  }

  getAccount(i){
    return this.list[i];
  }
}

export default Group;
