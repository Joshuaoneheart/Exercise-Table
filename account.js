import * as admin from 'firebase-admin';

//新增帳戶(Token 網頁使用的函式)
//正常回傳值為0
//錯誤碼
//-1:該住戶已存在
function register(name, token){
  //如住戶不在名冊中，回傳-1
  get_systemVariable();
  Logger.log(name, sysVariable.unregistered.includes(name), token);
  if(sysVariable.unregistered.includes(name)){
    sysVariable.resident[name]["token"] = token;
    sysVariable.unregistered.splice(sysVariable.unregistered.indexOf(name), 1);
    write_json(system_id, sysVariable);
  }
  else return -1;
  return 1;
}

//刪除活力組
//正常回傳值為0
//錯誤碼
//-1:尚有住戶未刪除
//-2:活力組不存在
function deleteGroup(name, gender){
  if((gender + name) in sysVariable.group){
    delete sysVariable.group[gender + name];
  }
  else return -2;
  var recordSheet = SpreadsheetApp.openById(sysVariable.id.record).getSheetByName(gloVariable.thisWeek);
  //若為姊妹活力組，找分隔線的位置
  if(dealGender(gender) == "bs"){
    for(let i = gvar_startRow;i < recordSheet.getLastRow();i++){
      if(recordSheet.getRange(i, 1).getBackground() == sysVariable.sisterColor){
          sysVariable.startRow = i;
          break;
      }
    }
  }
  var line = getLine(name, recordSheet, 1);
  //若活力組不存在則回傳2
  if(line < 0) return 2;
  Logger.log(line);
  //若尚有住戶未刪除則回傳-1
  if(!recordSheet.getRange(line - 1, 2).isBlank()) return -1;
  var jsonFile = DriveApp.getFileById(system_id);
  jsonFile.setContent(JSON.stringify(sysVariable));
  recordSheet.deleteRow(line);
  return 0;
}

const createJwt = ({ privateKey, expiresInHours, data = {} }) => {
	admin.initializeApp({
  		serviceAccountId: 'my-client-id@my-project-id.iam.gserviceaccount.com',
	});
};

const generateAccessToken = (account) => {
  // Your super secret private key

  const accessToken = createJwt({
    privateKey,
    expiresInHours: 12, // expires in 6 hours
    data: {
      iss: Session.getActiveUser().getEmail(),
      account: account
    },
  });
  return accessToken;
};

const parseJwt = (jsonWebToken, privateKey) => {
  const [header, payload, signature] = jsonWebToken.split('.');
  const signatureBytes = Utilities.computeHmacSha256Signature(
    `${header}.${payload}`,
    privateKey
  );
  const validSignature = Utilities.base64EncodeWebSafe(signatureBytes);
  if (signature === validSignature.replace(/=+$/, '')) {
    const blob = Utilities.newBlob(
      Utilities.base64Decode(payload)
    ).getDataAsString();
    const { exp, ...data } = JSON.parse(blob);
    if (new Date(exp * 1000) < new Date()) {
      throw new Error('The token has expired');
    }
    return data;
  } else return -1;
};

function hash (string) {
  var signature = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, string);
  return signature.map(function(byte) {
        // Convert from 2's compliment
        var v = (byte < 0) ? 256 + byte : byte;

        // Convert byte to hexadecimal
        return ("0" + v.toString(16)).slice(-2);
    }).join("");
}

function login(account, password) {
  if(!start()) return -3;
  var account_data = read_json(login_id);
  if(account_data[account] == undefined) return -1;
  if(account_data[account].password != hash(password)) return -2;
  if(account_data[account].state == "inactive") return -3;
  var session = CacheService.getUserCache();
  delete account_data[account].password;
  var jwt = generateAccessToken(account_data[account]);
  console.log(jwt)
  //登入的session會在使用者的browser存在12小時
  session.put("Login", jwt, sysVariable.day / 2);
  return makeToken(account_data[account]);
}

function loadSession () {
  if(!start()) return 0;
  var session = CacheService.getUserCache();
  var cache = session.get("Login");
  if(cache == null) return 0;
  var jwt = parseJwt(cache, privateKey);
  console.log(jwt)
  if(jwt == -1 || jwt.iss != Session.getActiveUser().getEmail()) return 0;
  return makeToken(jwt.account);
}

function getToken (token) {
  var session = CacheService.getUserCache();
  var account = session.get("Register");
  var tmp = read_json(token_pool_id);
  tmp[account] = token;
  write_json(token_pool_id, tmp)
}

function register (account, password) {
  if(!start()) return -1;
  if(!sysVariable.unregistered.includes(account)) return -2;
  var res = read_json(login_id);
  res[account] = hash(password);
  write_json(login_id, res);
  var session = CacheService.getUserCache();
  session.put("Register", account);
  return 1;
}

function getFirebaseService() {
  var base = read_json(firebase_id);
  return OAuth2.createService('Firebase')
      // Set the endpoint URL.
      .setTokenUrl('https://accounts.google.com/o/oauth2/token')

      // Set the private key and issuer.
      .setPrivateKey(base.private_key)
      .setIssuer(base.client_email)

      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getScriptProperties())

      // Set the scopes.
      .setScope('https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/firebase.database');
}

function find_Name_By_uid(uid){
  var login_data = read_json(login_id);
  for(key of Object.keys(login_data))
    if(login_data[key].uid == uid) return key;
  return "Error!";
}

function makeToken(account){
  var token = getFirebaseService().getAccessToken();
  var base = FirebaseApp.getDatabaseByUrl(firebaseUrl, token);
  var firebase_f = read_json(firebase_id);
  //(userEmail, optAuthData, serviceAccountEmail, privateKey)
  var token = base.createAuthToken(Session.getActiveUser().getEmail(), account, firebase_f.client_email, firebase_f.private_key);
  //用中文在 Session 中存名字會出現亂碼
  account.name = find_Name_By_uid(account.uid);
  return {"account": account, "token": token};
}
