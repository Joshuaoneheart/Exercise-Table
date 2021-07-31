/* import React */
import React from "react";
import ReactDOM from "react-dom";
/* import jquery */
import $ from 'jquery'
import 'jquery-ui-dist/jquery-ui.js'

/* import firebase */
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";
import "firebase/firestore";

/* import fullcalendar */
/*
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
*/

class Login extends React.Component {

	constructor (props) {
	  super(props);
	  this.account = React.createRef();
	  this.password = React.createRef();
	}

	login () {
	  firebase.auth().signInWithEmailAndPassword(this.account.current.value + "@hall19.com", this.password.current.value).catch(
	  	  function(error){
			  //var errorCode = error.code;
			  var errorMessage = error.message;
			  window.alert("Error : " + errorMessage);
		  })
	}
	render (){
	  return (
		<form className="form-signin" style={{borderRadius:"14px"}}>
		  <h2 style={{marginBottom: "22px"}} className="form-signin-heading">Please sign in</h2>
		  <div className="control-group" id="account_group">
			<div className="controls">
			  <input style={{marginBottom: "8px"}}type="text" className="input-block-level" placeholder="Account" ref={this.account}/>
			  <span style={{marginTop: "5px", display: "none"}} className="help-inline" id="account_warning">帳號不存在</span>
			</div>
		  </div>
		  <div className="control-group" id="password_group">
			<div className="controls">
			  <input style={{marginBottom: "8px"}} type="password" className="input-block-level" placeholder="Password" ref={this.password}/>
			  <span className="help-inline" style={{display: "none"}} id="password_warning">密碼錯誤</span>
			</div>
		  </div>
		  <div style={{padding: "10px"}}>
			<button style={{float: "center", marginRight: "30px"}} className="btn btn-large btn-primary" onClick={(e) => {e.preventDefault();this.login();}} type="submit">Sign in</button>
			<button style={{float: "center", marginTop: "12px"}} className="btn" type="submit" onClick={() => this.props.change_page(Register)}>Sign up</button>
		  </div>
		</form>
	  );
	}

}

class Register extends React.Component {

	constructor (props) {
	  super(props);
	  this.account = React.createRef();
	  this.password = React.createRef();
	  this.check_password = React.createRef();
	}

	onChange () {
	  if(this.password.current.value !== this.check_password.current.value){
		$("#warning").show();
		$('#sign_up_btn').attr("disabled",true);
		$("#check_group").addClass("error");
	  }
	  else{
		$("#warning").hide();
		$('#sign_up_btn').attr("disabled", false);
		$("#check_group").removeClass("error");
	  }
	}

	register () {
	  this.props.change_page(Loading);
	  window.open("http://bit.ly/CHURCH19-REGISTER?name=" + this.account.current.value);
	  /*
	  google.script.run.withSuccessHandler((exit_code) => {
		switch(exit_code){
		  case -1:
			alert("系統關閉維護中");
		  break;
		  case -2:
			alert("住戶未列於住戶名單內，若你確實有入住台大台科大弟兄姊妹之家，請通知服事者取得協助");
		  break;
		  case 1:
			alert("註冊成功");
		  break;
		}
		this.props.change_page(Login);
	  }).register(this.account.current.value, this.password.current.value);
	  */
	}

	render () {
	  return (
		<form className="form-signin" style={{borderRadius:"14px"}}>
		  <h2 style={{marginBottom: "22px"}} className="form-signin-heading">Please sign up</h2>
		  <input type="text" className="input-block-level" placeholder="Account" ref={this.account}/>
		  <input type="password" className="input-block-level" placeholder="Password" ref={this.password}/>
		  <div className="control-group" id="check_group">
			<div className="controls">
			  <input style={{marginBottom: "8px"}} type="password" className="input-block-level" onChange={() => this.onChange()} placeholder="Check Your Password" ref={this.check_password}/>
			  <span className="help-inline" style={{display: "none"}} id="warning">與密碼不相符</span>
			</div>
		  </div>
		  <div style={{padding: "10px"}}>
			<button style={{float: "center", marginRight: "30px"}} id="sign_up_btn" className="btn btn-large btn-primary" onClick={(e) => {e.preventDefault();this.register();}} type="submit">Sign up</button>
			<button style={{float: "center", marginTop: "12px"}} className="btn" onClick={() => this.props.change_page(Login)} type="submit" >Back to Sign in</button>
		  </div>
		</form>
	  );
	}

}

class Loading extends React.Component {
  
  constructor(props){
	super(props);
	this.urls = {
	  "Pulse": "//drive.google.com/uc?id=1sEhhZh69HAqHrnH6JrLbbiDeI9w8Ia3M",
	  "Spinner": "//drive.google.com/uc?id=1nVljM5_momO59d9S2zX8XLeU_968viHl"
	}
  }

  render(){
	return (
	  <div style={{margin:"0px auto"}}>
		<img alt="loading" src={this.urls["Pulse"]} style={{display:"block", margin:"auto"}} />
	  </div>
	)
  }

}

/*
google.script.run.withSuccessHandler((res) => {
//firebase config and initialization
if(!res) ReactDOM.render(<Main_Login />, document.getElementById('root'));
else{
  firebase.auth().signInWithCustomToken(res.token)
  .then((userCredential) => {
	// Signed in
	var user = userCredential.user;
	window.account = res.account;
	window.db.doc("管理資訊").get().then((snapshot) => {
	  window.manage_information = snapshot.data();
	  $("#root").removeClass("container");
	  $("#login").attr("id", "");
	  ReactDOM.render(<Index />, document.getElementById('root'));
	});
  })
  .catch((error) => {
	var errorCode = error.code;
	var errorMessage = error.message;
	console.log(errorCode, errorMessage);
  });
}
}).loadSession();*/


// script of Index page
$(function() {
	// Side Bar Toggle
	$('.hide-sidebar').click(function() {
		$('#sidebar').hide('fast', function() {
			$('#content').removeClass('span9');
			$('#content').addClass('span12');
			$('.hide-sidebar').hide();
			$('.show-sidebar').show();
		});
	});

	$('.show-sidebar').click(function() {
		$('#content').removeClass('span12');
		$('#content').addClass('span9');
		$('.show-sidebar').hide();
		$('.hide-sidebar').show();
		$('#sidebar').show('fast');
	});
});

 class Index extends React.Component {

    constructor (props) {
      super(props);
      this.frame_ref = React.createRef();
    }

	/*
    componentDidMount () {
      var index = 0;
      window.db.doc("data").collection("unfilled").get().then((snapshot) => {
        window.week_list = [];
        snapshot.forEach((doc) => {
          window.week_list.push(doc.id);
          index++;
          if(index == snapshot.docs.length){
            window.week_list.sort((a, b) => {
              var a_t = a.split("-").join("~").split("~");
              var b_t = b.split("-").join("~").split("~");
              a_t = a_t.map(Number);
              b_t = b_t.map(Number);
              if(a_t[0] >= 8) a_t[0] -= 12;
              if(b_t[0] >= 8) b_t[0] -= 12;
              return (a_t[0] == b_t[0])? ((a_t[1] < b_t[1])? 1 : -1) : ((a_t[0] < b_t[0])? 1 : -1);
            });
          }
        });
      });
      window.db.doc("system").get().then((snapshot) => {window.sysVar = snapshot.data();
        google.script.run.withSuccessHandler((enabled) => {window.sysVar.enabled = enabled;this.setState({isLoad: true});}).start();
      });
    }
*/
    toMainPage = () => {
      this.frame_ref.current.main.current.setState({page: "Announcement"});
    }

	logout(){
		firebase.auth().signOut().catch((error) => {
			// var errorCode = error.code;
			var errorMessage = error.message;
			window.alert("Error : " + errorMessage);
		});
	}

    render () {
	  /*
      if(window.account != undefined){
        this.name = window.account.name;
        switch(window.account.privilege){
          case 0:
            this.frame = Admin_Frame;
          break;
          case 1:
            this.frame = Frame;
          break;
          case 2:
            this.frame = User_Frame;
          break;
        }
      }
      else this.frame = Loading;
		*/
      return (
        <div>
          <div className="navbar navbar-fixed-top">
            <div className="navbar-inner">
                  <div className="container-fluid">
                      <a href="/#" className="btn btn-navbar" data-bs-toggle="collapse" data-bs-target=".nav-collapse"> <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                      </a>
                      <a className="brand" href="/#" onClick={this.toMainPage}>Exercise Table</a>
                      <div className="nav-collapse collapse">
                          <ul className="nav pull-right">
                              <li className="dropdown">
                                  <a href="/#" role="button" className="dropdown-toggle" data-bs-toggle="dropdown"> <i className="icon-user"></i> {this.name} <i className="caret"></i>

                                  </a>
                                  <ul className="dropdown-menu">
                                      <li>
                                          <a tabIndex="-1" href="/#">Profile</a>
                                      </li>
                                      <li className="divider"></li>
                                      <li>
                                          <a tabIndex="-1" href="/#" onClick={this.logout}>Logout</a>
                                      </li>
                                  </ul>
                              </li>
                          </ul>
                          <ul className="nav">
                              <li className="active">
                                  <a href="/#">Dashboard</a>
                              </li>
                              <li className="dropdown">
                                  <a href="/#" data-bs-toggle="dropdown" className="dropdown-toggle">Settings <b className="caret"></b>

                                  </a>
                                  <ul className="dropdown-menu" id="menu1">
                                      <li>
                                          <a href="/#">Tools <i className="icon-arrow-right"></i>

                                          </a>
                                          <ul className="dropdown-menu sub-menu">
                                              <li>
                                                  <a href="/#">Reports</a>
                                              </li>
                                              <li>
                                                  <a href="/#">Logs</a>
                                              </li>
                                              <li>
                                                  <a href="/#">Errors</a>
                                              </li>
                                          </ul>
                                      </li>
                                      <li>
                                          <a href="/#">SEO Settings</a>
                                      </li>
                                      <li>
                                          <a href="/#">Other Link</a>
                                      </li>
                                      <li className="divider"></li>
                                      <li>
                                          <a href="/#">Other Link</a>
                                      </li>
                                      <li>
                                          <a href="/#">Other Link</a>
                                      </li>
                                  </ul>
                              </li>
                              <li className="dropdown">
                                  <a href="/#" role="button" className="dropdown-toggle" data-bs-toggle="dropdown">Content <i className="caret"></i>

                                  </a>
                                  <ul className="dropdown-menu">
                                      <li>
                                          <a tabIndex="-1" href="/#">Blog</a>
                                      </li>
                                      <li>
                                          <a tabIndex="-1" href="/#">News</a>
                                      </li>
                                      <li>
                                          <a tabIndex="-1" href="/#">Custom Pages</a>
                                      </li>
                                      <li>
                                          <a tabIndex="-1" href="/#">Calendar</a>
                                      </li>
                                      <li className="divider"></li>
                                      <li>
                                          <a tabIndex="-1" href="/#">FAQ</a>
                                      </li>
                                  </ul>
                              </li>
                              <li className="dropdown">
                                  <a href="/#" role="button" className="dropdown-toggle" data-bs-toggle="dropdown">Users <i className="caret"></i>

                                  </a>
                                  <ul className="dropdown-menu">
                                      <li>
                                          <a tabIndex="-1" href="/#">User List</a>
                                      </li>
                                      <li>
                                          <a tabIndex="-1" href="/#">Search</a>
                                      </li>
                                      <li>
                                          <a tabIndex="-1" href="/#">Permissions</a>
                                      </li>
                                  </ul>
                              </li>
                          </ul>
                      </div>
                  </div>
              </div>
          </div>
		  {/*{React.createElement(this.frame, {ref: this.frame_ref})}}*/}
        </div>
      );
    }
  }

class Main extends React.Component {

	constructor (props) {
	    super(props);
	    this.state = {
			page: Login
	    }
	 	firebase.auth().onAuthStateChanged((user) => {
			console.log(user);
	 		if(user){
 				//user is signed in
	    		$("#root").removeClass("container");
	    		$("#login").attr("id", "no-login");
				this.change_page(Index);
			}
			else{
				//no user is signed in
	    		$("#root").addClass("container");
	    		$("#no-login").attr("id", "login");
				this.change_page(Login);
			}
		});
	}

	change_page = (page) => {
	  this.setState({page: page});
	}

	render () {
	  return React.createElement(this.state.page, {change_page: this.change_page, default: this.props.default});
	}

}

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
ReactDOM.render(<Loading pattern="Pulse" />, document.getElementById('root'));
// Initialize Firebase
if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}else {
	firebase.app();
}
firebase.analytics();
window.semester = "109上";
window.firestore = firebase.firestore();
window.db = firebase.firestore().collection(window.semester);
window.Announcement_db = firebase.firestore().collection("公告");
ReactDOM.render(<Main />, document.getElementById('root'));
