import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

var config = {
  apiKey: "AIzaSyBRYT6ipwBqNlt8xqkU2NfPV5XpU0PXxsE",
  authDomain: "exercising-table-data.firebaseapp.com",
  databaseURL: "https://exercising-table-data-default-rtdb.firebaseio.com",
  projectId: "exercising-table-data",
  storageBucket: "exercising-table-data.appspot.com",
  messagingSenderId: "820908125256",
  appId: "1:820908125256:web:dbd81b7b5fcadf7c743c7d",
  measurementId: "G-TJ2TJXC3N7",
};

firebase.initializeApp(config);

class Firebase {
  constructor(firebase) {
    this.firebase = firebase;
    this.interval_ids = [];
  }

  async signOut() {
    try {
      await this.firebase.auth().signOut();
      for (let interval_id of this.interval_ids) {
        clearInterval(interval_id);
      }
    } catch (e) {
      alert(e.message);
    }
  }

  addIntervalId(id) {
    this.interval_ids.push(id);
  }

  async getByUrl(url) {
    let db = this.firebase.firestore();
    let path = url.split("/");
    let flag = 0;
    for (let i = 1; i < path.length; i++) {
      if (!flag) db = db.collection(path[i]);
      else db = db.doc(path[i]);
      flag = !flag;
    }
    try {
      let data = await db.get();
      if (data.data) return data.data();
      else return data;
    } catch (e) {
      alert(e.message);
    }
  }

  async setByUrl(url, data) {
    let db = this.firebase.firestore();
    let path = url.split("/");
    let flag = 0;
    for (let i = 1; i < path.length; i++) {
      if (!flag) db = db.collection(path[i]);
      else db = db.doc(path[i]);
      flag = !flag;
    }
    try {
      await db.set(data);
    } catch (e) {
      alert(e.message);
    }
  }

  async updateByUrl(url, data) {
    let db = this.firebase.firestore();
    let path = url.split("/");
    let flag = 0;
    for (let i = 1; i < path.length; i++) {
      if (!flag) db = db.collection(path[i]);
      else db = db.doc(path[i]);
      flag = !flag;
    }
    try {
      await db.update(data);
    } catch (e) {
      alert(e.message);
    }
  }

  async OnDemandUpdate(url, data) {
    let db = this.firebase.firestore();
    let path = url.split("/");
    let flag = 0;
    for (let i = 1; i < path.length; i++) {
      if (!flag) db = db.collection(path[i]);
      else db = db.doc(path[i]);
      flag = !flag;
    }
    try {
      let doc = await db.get();
      if (doc.exists) this.updateByUrl(url, data);
      else this.setByUrl(url, data);
    } catch (e) {
      alert(e.message);
    }
  }
}

var DB = new Firebase(firebase);

export { config, firebase, DB };
