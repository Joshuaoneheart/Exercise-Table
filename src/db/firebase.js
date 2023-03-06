import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

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
	}
	
	async getByUrl(url){
		let db = this.firebase.firestore();
		let path = url.split('/');
		let flag = 0;
		for(let i = 1;i < path.length;i++){
			if(!flag) db = db.collection(path[i]);
			else db = db.doc(path[i]);
			flag = !flag;
		}
		try {
			let data = await db.get();
			return data.data();
		} catch (e) {
			console.log(e);
		}
	}
}

var DB = new Firebase(firebase);

export { config, firebase, DB };
