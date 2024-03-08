import Account from "./Account";
import Group from "./Group";
import { firebase } from "../db/firebase";

class Groups {
  constructor(account_list = [], id_list = [], map) {
    if (!id_list.length) return;
    this.new_num = 0;
    this.map = map;
    this.list = [new Group("all")];
    this.deleted = [];
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
    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i].id !== "all") {
        new_ids.push(this.list[i].id);
        new_list.push(new Group(this.list[i].id, this.list[i].name, []));
      }
    }

    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this.list[i].length; j++) {
        let group = this.getAccount(i, j)[by];
        if (!group) continue;
        if (!new_ids.includes(group)) {
          let new_group = new Group(group, this.map[group], []);
          new_list.push(new_group);
          new_ids.push(group);
        }
        new_list[new_ids.indexOf(group)].pushAccount(this.getAccount(i, j));
      }
    }
    this.list = new_list;
  }

  async save(page) {
    let tmp = {};
    for (let i = 0; i < this.length; i++) {
      if (this.ids[i].startsWith("tmp|")) {
        let res = await firebase
          .firestore()
          .collection(page)
          .add({ name: this.names[i] });
        tmp[this.ids[i]] = res.id;
        this.list[i].id = res.id;
        delete this.map[this.ids[i]];
        this.map[res.id] = this.names[i];
      }
    }
    for (let i = 0; i < this.deleted.length; i++) {
      if(!this.deleted[i].id.startsWith("tmp|")) await firebase
        .firestore()
        .collection(page)
        .doc(this.deleted[i].id)
        .get()
        .then((snapshot) => {
          snapshot.ref.delete();
        });
    }
    this.deleted = [];
    for (let i = 0; i < this.length; i++) {
      for (let j = 0; j < this.list[i].length; j++) {
        if (this.getAccount(i, j)[page] in tmp)
          this.getAccount(i, j).update(page, tmp[this.getAccount(i, j)[page]]);
        await this.getAccount(i, j).save();
      }
    }
    this.groupBy(page);
  }

  get length() {
    return this.list.length;
  }

  get names() {
    return this.list.map((x) => x.name);
  }

  get ids() {
    return this.list.map((x) => x.id);
  }

  clone() {
    let new_group = new Groups();
    new_group.list = this.list;
    new_group.map = this.map;
    new_group.new_num = this.new_num;
    new_group.deleted = this.deleted;
    return new_group;
  }

  addGroup(name) {
    this.list.push(new Group("tmp|" + this.new_num, name, []));
    this.map["tmp|" + this.new_num] = name;
    this.new_num++;
  }

  deleteGroup(id) {
    let idx = this.indexOf(id);
    console.assert(JSON.stringify(this.list[idx].list) === JSON.stringify([]));
    this.list[idx].id = id;
    delete this.map[id];
    this.deleted.push(this.list[idx]);
    this.list.splice(idx, 1);
  }
}

export default Groups;
