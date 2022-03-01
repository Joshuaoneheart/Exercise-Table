import firebase from "firebase";

const AddGF = async (data) => {
  return await firebase.firestore().collection("GF").add(data);
};

export { AddGF };
