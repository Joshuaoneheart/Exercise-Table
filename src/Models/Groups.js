import Account from "./Account";
import Group from "./Group";

class Groups {
  constructor(account_list = [], id_list = []) {
    if(!id_list.length) return;
    this.list = [new Group("all")];
    for (let i = 0; i < account_list.length; i++) {
      let account = account_list[i];
      account.id = id_list[i];
      this.list[0].pushAccount(new Account(account));
    }
  }

  indexOf(id) {
    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i].id === id) return i;
    }
    return -1;
  }

  includes(id) {
    return this.indexOf(id) !== -1;
  }

  getAccount(i, j) {
    return this.list[i].getAccount(j);
  }

  // by: one of all, group and residence
  groupBy(by) {
    console.assert(
      ["all", "group", "residence"].includes(by),
      "Argument must be one of all, group and residence"
    );
    if (by === "all") {
      let new_list = [new Group("all")];
      for (let i = 0; i < this.length; i++) {
        for (let j = 0; j < this.list[i].length; j++) {
          new_list[0].pushAccount(this.list[i].getAccount(j));
        }
      }
      this.list = new_list;
      return;
    }
    let new_list = [];
    let new_ids = [];

    for (let i = 0; i < this.length; i++) {
      let id = this.ids[i];
      if (id !== "all") {
        new_ids.push(id);
        new_list.push(new Group(id, []));
      }
    }
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this.list[i].length; j++) {
        let group = this.getAccount(i, j)[by];
        if(!group) group = "";
        if (!new_ids.includes(group)) {
          let new_group = new Group(group, []);
          new_list.push(new_group);
          new_ids.push(group);
        }
        new_list[new_ids.indexOf(group)].pushAccount(this.getAccount(i, j));
      }
    }
    this.list = new_list;
  }

  async save() {
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this.list[i].length; j++) {
        await this.getAccount(i, j).save();
      }
    }
  }

  get length() {
    return this.list.length;
  }

  get names() {
    return this.list.filter((x) => x.id).map((x) => x.id);
  }

  get ids() {
    return this.list.map((x) => x.id);
  }

  clone() {
    let new_group = new Groups();
    new_group.list = this.list;
    return new_group;
  }

  addGroup(id) {
    this.list.push(new Group(id, []));
  }

  deleteGroup(id) {
    let idx = this.indexOf(id);
    console.assert(JSON.stringify(this.list[idx].list) === JSON.stringify([]));
    this.list.splice(idx, 1);
  }
}

export default Groups;
