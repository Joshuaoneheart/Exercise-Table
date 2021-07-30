var firebaseConfig = {
	    apiKey: "AIzaSyBRYT6ipwBqNlt8xqkU2NfPV5XpU0PXxsE",
	    authDomain: "exercising-table-data.firebaseapp.com",
	    databaseURL: "https://exercising-table-data-default-rtdb.firebaseio.com",
	    projectId: "exercising-table-data",
	    storageBucket: "exercising-table-data.appspot.com",
	    messagingSenderId: "820908125256",
	    appId: "1:820908125256:web:dbd81b7b5fcadf7c743c7d",
	    measurementId: "G-TJ2TJXC3N7"
};
Initialize Firebase
if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}else {
  firebase.app();
}
firebase.analytics();
