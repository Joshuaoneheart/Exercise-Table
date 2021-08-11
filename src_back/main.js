  class Index extends React.Component {
    
    constructor (props) {
      super(props);
      this.frame_ref = React.createRef();
    }

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
      this.frame_ref = React.createRef();
    }
    
    toMainPage = () => {
      this.frame_ref.current.main.current.setState({page: "Announcement"});
    }

    render () {
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
        
      return (
        <div>
          <div className="navbar navbar-fixed-top">
            <div className="navbar-inner">
                  <div className="container-fluid">
                      <a className="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse"> <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                      </a>
                      <a className="brand" href="#" onClick={this.toMainPage}>Exercise Table</a>
                      <div className="nav-collapse collapse">
                          <ul className="nav pull-right">
                              <li className="dropdown">
                                  <a href="#" role="button" className="dropdown-toggle" data-toggle="dropdown"> <i className="icon-user"></i> {this.name} <i className="caret"></i>

                                  </a>
                                  <ul className="dropdown-menu">
                                      <li>
                                          <a tabIndex="-1" href="#">Profile</a>
                                      </li>
                                      <li className="divider"></li>
                                      <li>
                                          <a tabIndex="-1" href="login.html">Logout</a>
                                      </li>
                                  </ul>
                              </li>
                          </ul>
                          <ul className="nav">
                              <li className="active">
                                  <a href="#">Dashboard</a>
                              </li>
                              <li className="dropdown">
                                  <a href="#" data-toggle="dropdown" className="dropdown-toggle">Settings <b className="caret"></b>

                                  </a>
                                  <ul className="dropdown-menu" id="menu1">
                                      <li>
                                          <a href="#">Tools <i className="icon-arrow-right"></i>

                                          </a>
                                          <ul className="dropdown-menu sub-menu">
                                              <li>
                                                  <a href="#">Reports</a>
                                              </li>
                                              <li>
                                                  <a href="#">Logs</a>
                                              </li>
                                              <li>
                                                  <a href="#">Errors</a>
                                              </li>
                                          </ul>
                                      </li>
                                      <li>
                                          <a href="#">SEO Settings</a>
                                      </li>
                                      <li>
                                          <a href="#">Other Link</a>
                                      </li>
                                      <li className="divider"></li>
                                      <li>
                                          <a href="#">Other Link</a>
                                      </li>
                                      <li>
                                          <a href="#">Other Link</a>
                                      </li>
                                  </ul>
                              </li>
                              <li className="dropdown">
                                  <a href="#" role="button" className="dropdown-toggle" data-toggle="dropdown">Content <i className="caret"></i>

                                  </a>
                                  <ul className="dropdown-menu">
                                      <li>
                                          <a tabIndex="-1" href="#">Blog</a>
                                      </li>
                                      <li>
                                          <a tabIndex="-1" href="#">News</a>
                                      </li>
                                      <li>
                                          <a tabIndex="-1" href="#">Custom Pages</a>
                                      </li>
                                      <li>
                                          <a tabIndex="-1" href="#">Calendar</a>
                                      </li>
                                      <li className="divider"></li>
                                      <li>
                                          <a tabIndex="-1" href="#">FAQ</a>
                                      </li>
                                  </ul>
                              </li>
                              <li className="dropdown">
                                  <a href="#" role="button" className="dropdown-toggle" data-toggle="dropdown">Users <i className="caret"></i>

                                  </a>
                                  <ul className="dropdown-menu">
                                      <li>
                                          <a tabIndex="-1" href="#">User List</a>
                                      </li>
                                      <li>
                                          <a tabIndex="-1" href="#">Search</a>
                                      </li>
                                      <li>
                                          <a tabIndex="-1" href="#">Permissions</a>
                                      </li>
                                  </ul>
                              </li>
                          </ul>
                      </div>
                  </div>
              </div>
          </div>
          {React.createElement(this.frame, {ref: this.frame_ref})}
        </div>
      );
    }
  }

  class Announcement extends React.Component {
    
    constructor(props) {
      super(props);
      this.block = React.createRef();
    }

    componentDidMount () {
      window.Announcement_db.orderBy("timestamp").get().then((snapshot) => {
        var row = [];
        snapshot.forEach((doc) => {
          row.push([doc.data().title, doc.data().content]);
        });
        this.block.current.setState({isLoad: true, args:{col_titles: ["標題", "內容"], row: row.reverse()}})
      })
    }

    render() {
      return (
        <Block title="公告" badge={false} content={DataTable} isLoad={false} ref={this.block} args={{showModal: this.props.showModal}}/>
      );
    }

  }

  class Summary extends React.Component {
    
    constructor(props) {
      super(props);
      this.block_num = 4;
      this.block = new Array(this.block_num).fill(null).map(() => {return React.createRef()});
      this.block_data = new Array(this.block_num);
      this.per_two_week = [];
      for(var i = window.week_list.length - 1;i >= 0;i--){
        if((window.week_list.length - i - 1) % 2 == 1){
          this.per_two_week.push([window.week_list[i + 1], window.week_list[i]]);
        }
      }
      this.per_two_week = this.per_two_week.reverse();
    }

    componentDidMount () {
      //processing data of block[0]
      this.block_data[0] = [];
      for(var i = 0;i < window.sysVar.unregistered.length;i++){
        this.block_data[0].push([i + 1, window.sysVar.unregistered[i]]);
      }
      this.block[0].current.setState({isLoad: true, number: this.block_data[0].length, badge_content: Table, badge_content_args: {col_titles: ["#", "姓名"], row: this.block_data[0], isLoad: true}, args: {row: this.block_data[0].slice(0, 4)}});
      
      //processing data of block[1]
      this.prepare_data_fill(0);

      //processing data of block[2] and block[3]
      this.prepare_data_rank(0);
    }

    prepare_data_rank = (two_week_index) => {
      var two_week = this.per_two_week[two_week_index];
      window.db.doc("data").collection("person").doc(two_week[0]).collection("response").get().then(((snapshot_1) => {
        window.db.doc("data").collection("person").doc(two_week[1]).collection("response").get().then(((snapshot_2) => {
          //processing data of block[2]
          this.block_data[2] = [];
          //processing data of block[3]
          this.block_data[3] = [];
          var person_score_pair = {};
          var index = 0;
          if(!snapshot_1.docs.length && !snapshot_2.docs.length){
            this.block[2].current.setState({isLoad: true, number: this.block_data[2].length, badge_content: Table, badge_content_args: {col_titles: ["#", "姓名", "分數"], row: this.block_data[2], isLoad: true}, args: {row: this.block_data[2].slice(0, 4)}});
            this.block[3].current.setState({isLoad: true, number: this.block_data[3].length, badge_content: Table, badge_content_args: {col_titles: ["#", "姓名", "分數"], row: this.block_data[3], isLoad: true}, args: {row: this.block_data[3].slice(0, 4)}});
          }
          else if(snapshot_1.docs.length && snapshot_2.docs.length){

            snapshot_1.forEach(((person) => {
              person_score_pair[person.id] = [];
              person_score_pair[person.id].push(person.data().total_score);
              index++;
              if(index == snapshot_1.docs.length){
                index = 0;

                snapshot_2.forEach(((person) => {
                  if(person_score_pair[person.id] == undefined) person_score_pair[person.id] = [];
                  person_score_pair[person.id].push(person.data().total_score);
                  index++;

                  if(index == snapshot_2.docs.length){
                    for(var k of Object.keys(person_score_pair)){
                      var total_score = 0;
                      for(var s of person_score_pair[k]){
                        total_score += s;
                      }
                      person_score_pair[k] = total_score;
                    }

                    var person = Object.keys(person_score_pair);
                    person.sort((a, b) => {
                      return person_score_pair[a] < person_score_pair[b]? 1: -1;
                    });

                    for(var i = 0;i < person.length;i++){
                      this.block_data[2].push([i + 1, person[i], person_score_pair[person[i]]]);
                    }

                    var groups = Object.keys(window.sysVar.group);
                    var group_score_pair = {};
                    for(var group of groups){
                      group_score_pair[group] = 0;
                      for(var man of window.sysVar.group[group].member){
                        if(person_score_pair[man] != undefined) group_score_pair[group] += person_score_pair[man];
                      }
                    }

                    groups.sort((a, b) => {
                      return group_score_pair[a] < group_score_pair[b]? 1: -1;
                    });

                    for(var i = 0;i < groups.length;i++){
                      this.block_data[3].push([i + 1, groups[i], group_score_pair[groups[i]]]);
                    }

                    this.block[2].current.setState({isLoad: true, number: this.block_data[2].length, badge_content: Table, badge_content_args: {col_titles: ["#", "姓名", "分數"], row: this.block_data[2], isLoad: true}, args: {row: this.block_data[2].slice(0, 4)}});
                    this.block[3].current.setState({isLoad: true, number: this.block_data[3].length, badge_content: Table, badge_content_args: {col_titles: ["#", "姓名", "分數"], row: this.block_data[3], isLoad: true}, args: {row: this.block_data[3].slice(0, 4)}});
                  }
                }).bind(this));
              }
            }).bind(this));
          }
        }).bind(this));
      }).bind(this));
    }

    prepare_data_fill = (week_index) => {
      var week = window.week_list[week_index];
      window.db.doc("data").collection("unfilled").doc(week).get().then(((snapshot) => {
        var data = snapshot.data();
        //processing data of block[1]
        this.block_data[1] = [];
        for(var i of Object.keys(data)){
          this.block_data[1].push([Number(i) + 1, data[i]]);
        }
        this.block[1].current.setState({isLoad: true, number: this.block_data[1].length, badge_content: Table, badge_content_args: {col_titles: ["#", "姓名"], row: this.block_data[1], isLoad: true}, args: {row: this.block_data[1].slice(0, 4)}});
      }).bind(this));
    }

    render() {
      return (
        <div>
          <Block content={false} title="總覽" data_toggle_bar={true} badge={false} isLoad={false} args={{}}/>
          <div id="總覽_div">
            <div className="row-fluid">
              <div className="span6">
                <Block content={Table} title="未註冊人位" badge={true} isLoad={false} ref={this.block[0]} showModal={this.props.showModal} args={{col_titles: ["#", "姓名"]}}/>
              </div>
            </div>
          </div>
          <Block content={Selection} title="表單填寫情形" data_toggle_bar={true} badge={false} isLoad={false} args={{options: window.week_list, onChange: this.prepare_data_fill}}/>
          <div id="表單填寫情形_div">
            <div className="row-fluid">
              <div className="span6">
                <Block content={Table} title="未填人位" badge={true} isLoad={false} ref={this.block[1]} showModal={this.props.showModal} args={{col_titles: ["#", "姓名"]}}/>
              </div>
            </div>
          </div>
          <Block content={Selection} title="排名" badge={false} data_toggle_bar={true} isLoad={false} args={{options: this.per_two_week.map((x) => {return x[0].split("~")[0] + "~" + x[1].split("~")[1]}), onChange: this.prepare_data_rank}}/>
          <div id="排名_div">
            <div className="row-fluid">
              <div className="span6">
                <Block content={Table} title="個人周排名" badge={true} isLoad={false} ref={this.block[2]} showModal={this.props.showModal} args={{col_titles: ["#", "姓名", "分數"]}}/>
              </div>
              <div className="span6">
                <Block content={Table} title="活力組周排名" badge={true} isLoad={false} ref={this.block[3]} showModal={this.props.showModal} args={{col_titles: ["#", "姓名", "分數"]}}/>
              </div>
            </div>
          </div>
        </div>
      );
    }

  }

  class Table extends React.Component {

    constructor (props) {
      super(props);
    }

    render () {
      if(!this.props.isLoad) return <Loading pattern="Spinner" />;
      else if(!this.props.row.length) return <Text content="查無資料"/>
      return (
        <div className="block-content collapse in">
          <table className="table table-striped">
            <thead>
              <tr>
                {this.props.col_titles.map((x, i) => {return <th key={i}>{x}</th>})}
              </tr>
            </thead>
            <tbody>
              {this.props.row.map((x, i) => {return <tr key={i}>{this.props.row[i].map((y, j) => {return <td key={j}>{y}</td>})}</tr>})}
            </tbody>
          </table>
        </div>
      );
    }

  }

  class DataTable extends React.Component {

    constructor (props) {
      super(props);
    }

    componentDidMount () {
      $('#announcement').dataTable( {
        "sDom": "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>",
        "sPaginationType": "bootstrap",
        "oLanguage": {
          "sLengthMenu": "_MENU_ records per page"
        }
      });
    }

    render () {
      if(!this.props.isLoad) return <Loading pattern="Spinner" />;
      return (
        <div className="block-content collapse in">
          <div className="span12" align-items="center" justify-content="center">
            <table cellPadding="0" cellSpacing="0" border="0" className="table table-striped table-bordered" id="announcement">
              <thead>
                <tr>
                  <th width="15%">{this.props.col_titles[0]}</th>
                  <th>{this.props.col_titles[1]}</th>
                </tr>
              </thead>
              <tbody>
                {this.props.row.map((x, i) => {return <tr key={i}>
                  <td style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "0"}}>
                    <a href="#modal" data-toggle="modal" onClick={() => {this.props.showModal(this.props.row[i][0], Text, {content: this.props.row[i][1]})}}>
                      {this.props.row[i][0]}
                    </a>
                  </td>
                  <td style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "0"}}>
                    {this.props.row[i][1]}
                  </td>
                </tr>})}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

  }

  class Selection extends React.Component {

    constructor (props) {
      super(props);
      this.ref = React.createRef();
      this.block = React.createRef();
    }

    onChange = () => {
      if(this.props.onChange == undefined) return null;
      this.props.onChange(this.ref.current.selectedIndex);
    }

    unBlock = () => {
      $(this.block.current).removeClass("block-content");
    }

    setIndex = (index) => {
      this.ref.current.selectedIndex = index;
    }

    render () {
      return (
        <div className="block-content collapse in" ref={this.block}>
          <label>
            <select style={{width: "174px", marginTop: "5px", marginBottom: "0px"}} onChange={this.onChange} ref={this.ref}>
              {this.props.options.map((option, i) => {return <option value={option} key={i}>{option}</option>})}
            </select>
          </label>
        </div>
      );
    }

  }

  class Input extends React.Component {

    constructor (props) {
      super(props);
      this.ref = React.createRef();
      this.block = React.createRef();
    }

    unBlock = () => {
      $(this.block.current).removeClass("block-content");
    }

    setValue = (value) => {
      this.ref.current.value = value;
    }

    render () {
      return (
        <div className="block-content collapse in" ref={this.block}>
          <label>
            <input type="text" style={{width: "160px"}} onChange={this.props.onChange} ref={this.ref}/>
          </label>
        </div>
      );
    }

  }
  
  class Search_div extends React.Component {

    constructor (props) {
      super(props);
      this.selection = [React.createRef(), React.createRef()];
      this.submit_btn = React.createRef();
      this.subtitles = {
        "活力組":["性別", "活力組"],
        "個人":["住處", "姓名"]
      }
      this.default_option = ["請選取" + this.subtitles[this.props.name][0], "請先選取" + this.subtitles[this.props.name][0]]
    }

    refresh (){
      var index = this.selection[0].current.selectedIndex;
      var length = 0;
      if(!index){
        this.selection[1].current.options[1] = new Option('請先選取' + this.subtitles[this.props.name][0], '請先選取' + this.subtitles[this.props.name][0]);
        this.selection[1].current.length = 1;
        this.submit_btn.disabled = true;
        return;
      }

      if(this.props.name == "活力組"){
        var groups = Object.keys(window.sysVar.group).sort();
        for(var i=0;i<groups.length;i++){
          if((index == 1 && groups[i][0] == 'B') || (index == 2 && groups[i][0] == 'S')){
            this.selection[1].current.options[length] = new Option(groups[i].substr(1, 2), groups[i].substr(1, 2));	// 設定新選項
            length++;
          }
        }
      }
      else if(this.props.name == "個人"){
        for(var item of window.sysVar.residence[this.selection[0].current.value].member.sort().reverse()){
          this.selection[1].current.options[length] = new Option(item, item);
          length++;
        }
      }
      this.selection[1].current.length=length;	// 刪除多餘的選項
      this.submit_btn.current.disabled = false;
  }
  
    componentDidMount () {
      var length = 1;
      var default_options = {
        "活力組":["弟兄","姊妹"]
      }
      default_options["個人"] = Object.keys(window.sysVar.residence).sort().reverse();
      for(var item of default_options[this.props.name]){
        this.selection[0].current.options[length] = new Option(item, item);
        length++;
      }
      this.selection[0].current.length=length;
    }

    componentDidUpdate () {
      this.submit_btn.current.disabled = true;
      var length = 1;
      var default_options = {
        "活力組":["弟兄","姊妹"]
      }
      default_options["個人"] = Object.keys(window.sysVar.residence);
      for(var item of default_options[this.props.name]){
        this.selection[0].current.options[length] = new Option(item, item);
        length++;
      }
      this.selection[0].current.length=length;
      this.selection[0].current.options[0]  = new Option("請選取" + this.subtitles[this.props.name][0], "請選取" + this.subtitles[this.props.name][0]);
      this.selection[0].current.selectedIndex = 0;
      this.selection[1].current.length = 1;
      this.selection[1].current.options[0] = new Option("請先選取" + this.subtitles[this.props.name][0], "請先選取" + this.subtitles[this.props.name][0]);
    }

    render () {
      return (
        <div className="block-content collapse in">
          <div className="span12">
            <form id="search_form" className="form-horizontal" onSubmit={(e) => {e.preventDefault();this.props.search([this.selection[0].current.value, this.selection[1].current.value]);}}>
              <fieldset>
                <div className="control-group">
                  <label className="control-label" htmlFor="selectError">{this.subtitles[this.props.name][0]}</label>
                  <div className="controls">
                    <select onChange={() => {this.refresh()}}  ref={this.selection[0]}>
                      <option>{this.default_option[0]}</option>
                    </select>
                  </div>
                </div>
                <div className="control-group">
                  <label className="control-label" htmlFor="selectError">{this.subtitles[this.props.name][1]}</label>
                  <div className="controls">
                    <select ref={this.selection[1]}>
                      <option>{this.default_option[1]}</option>
                    </select>
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={true} ref={this.submit_btn}>Search</button>
                  <button type="reset" className="btn" onClick={() => {this.submit_btn.current.disabled = true;this.selection[1].current.length = 1;this.selection[1].current.options[0] = new Option(this.default_option[1], this.default_option[1]);}}>Cancel</button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      );
    }

  }
  
  class Result_div extends React.Component {
    
    constructor (props) {
      super(props);
      this.state = {
        args: this.props.args,
        has_Searched: false
      }
      this.block_num = 1;
      this.block = new Array(this.block_num).fill(null).map(() => {return React.createRef()});
      this.block_data = new Array(this.block_num);
    }
    
    prepare_pie_chart_data (data) {
      var pie_chart_titles = [];
      for(var item of window.sysVar.section){
        pie_chart_titles.push(item.name);
      }
      pie_chart_titles.push("總分");
      var pie_chart_score = [];
      var total_score = 0;
      for(var section of window.sysVar.section){
        total_score += data[section.name];
        pie_chart_score.push(data[section.name]);
      }
      pie_chart_score.push(total_score);
      var total_section_score = 0;
      var pie_subtitles = pie_chart_score.map((x, i) => {
        if(i == window.sysVar.section.length){
          return x + "/" + total_section_score;
        }
        total_section_score += window.sysVar.section[i].score;
        return x + "/" + window.sysVar.section[i].score;
      });

      pie_chart_score = pie_chart_score.map((x, i) => {
        if(i == window.sysVar.section.length){
          return (x / total_section_score * 100);
        }
        console.log(x / window.sysVar.section[i].score)
        return (x / window.sysVar.section[i].score * 100);
      });

      this.block[0].current.setState({isLoad: true, args: {titles: pie_chart_titles, data: pie_chart_score, subtitles: pie_subtitles}});
    }

    render () {
      if(!this.state.has_Searched) return null;
      if(this.props.name == "個人"){
        return (
          <div>
            <Block title="分數總覽" badge={false} content={Pie_Chart} ref={this.block[0]} args={{}}/>
          </div>
        );
      }
      else if(this.props.name == "活力組"){
        var gender_map = {
          "弟兄": "B",
          "姊妹": "S"
        }
        var gender = gender_map[this.state.args[0]];
        var group = this.state.args[1];
        return null;
      }
    }

  }
  
  class Block extends React.Component {

    constructor (props) {
      super(props);
      this.state = {
        isLoad: this.props.isLoad,
        number: 0
      }
      this.banner = React.createRef();
      this.content = React.createRef();
    }

    componentDidMount () {
      if(this.props.data_toggle_bar){
        $("#" + this.props.title +"_hide_button").hide();
        $("#" + this.props.title + "_content").hide();
        $("#" + this.props.title + "_div").hide();
      }
    }

    componentDidUpdate () {
      if(this.props.badge) this.banner.current.addEventListener("click", this.showModal);
    }

    showModal = () =>  {
      this.props.showModal(this.props.title, this.state.badge_content, this.state.badge_content_args);
    }

    toggle () {
      $("#" + this.props.title +"_show_button").toggle();
      $("#" + this.props.title +"_hide_button").toggle();
      $("#" + this.props.title + "_content").toggle();
      $("#" + this.props.title + "_div").toggle();
    }

    render () {
      var args = {...this.props.args, ...this.state.args};
      if(args["isLoad"] == undefined) args["isLoad"] = this.state.isLoad || this.props.isLoad;
      args["ref"] = this.content;
      return (
        <div className="block">
          <div className="navbar navbar-inner block-header">
            <div className="muted pull-left">
              {this.props.data_toggle_bar && <i className="icon-chevron-down" id={this.props.title+"_show_button"} onClick={(e) => {e.preventDefault();this.toggle()}}><a href="#">&nbsp;&nbsp;</a></i>}
              {this.props.data_toggle_bar && <i className="icon-chevron-up" id={this.props.title+"_hide_button"} onClick={(e) => {e.preventDefault();this.toggle()}}><a href="#">&nbsp;&nbsp;</a></i>}
              &nbsp;{this.props.title}
            </div>
            {this.props.badge && <div className="pull-right"><span className="badge badge-info" data-toggle="modal" href="#modal" ref={this.banner}>{this.state.number}</span></div>}
          </div>
          <div id={this.props.title+"_content"}>
            {this.props.content && React.createElement(this.props.content, args)}
          </div>
        </div>
      );

    }

  }

  class Pie_Chart extends React.Component {

    constructor (props) {
      super(props);
      this.chart_num = 4;
      this.chart = new Array(this.chart_num).fill(null).map(() => {return React.createRef()});
      this.hasDraw = false;
    }

    componentDidMount () {
      $('.chart').easyPieChart({animate: 1000});
    }

    componentDidUpdate () {
      var data = this.props.data;
      if(!this.hasDraw){
        $('.chart').easyPieChart({animate: 1000});
        this.hasDraw = true;
      }
      else $.map($(".chart"), (x, i) => {console.log(data[i]);$(x).data("easyPieChart").update(Number(data[i]));});
    }

    render () {
      if(!this.props.isLoad) return <Loading pattern="Spinner"/>
      return (
        <div className="block-content collapse in">
          <div className="span3">
            <div className="chart easyPieChart"  data-percent={this.props.data[0]} style={{width: "110px", height: "110px", lineHeight: "110px"}}>{this.props.subtitles[0]}<canvas width="110" height="110" ref={this.chart[0]}></canvas></div>
            <div className="chart-bottom-heading"><span className="label label-info">{this.props.titles[0]}</span>
            </div>
          </div>
          <div className="span3">
            <div className="chart easyPieChart" data-percent={this.props.data[1]} style={{width: "110px", height: "110px", lineHeight: "110px"}}>{this.props.subtitles[1]}<canvas width="110" height="110" ref={this.chart[1]}></canvas></div>
            <div className="chart-bottom-heading"><span className="label label-info">{this.props.titles[1]}</span>
            </div>
          </div>
          <div className="span3">
            <div className="chart easyPieChart" data-percent={this.props.data[2]} style={{width: "110px", height: "110px", lineHeight: "110px"}}>{this.props.subtitles[2]}<canvas width="110" height="110" ref={this.chart[2]}></canvas></div>
            <div className="chart-bottom-heading"><span className="label label-info">{this.props.titles[2]}</span>
            </div>
          </div>
          <div className="span3">
            <div className="chart easyPieChart" data-percent={this.props.data[3]} style={{width: "110px", height: "110px", lineHeight: "110px"}}>{this.props.subtitles[3]}<canvas width="110" height="110" ref={this.chart[3]}></canvas></div>
            <div className="chart-bottom-heading"><span className="label label-info">{this.props.titles[3]}</span>
            </div>
          </div>
        </div>
      );
    }
  }

  class Search_Result_Pair extends React.Component {
    
    constructor(props) {
      super(props);
      this.result_div = React.createRef();
      this.search_div = React.createRef();
      this.selection = React.createRef();
    }
    
    Search = (args) => {
      this.name = args[1];
      if(this.result_div.current == null) return;
      this.result_div.current.setState({args: args, has_Searched: true}, () => {
        if(this.props.name == "個人"){
          this.selection.current.content.current.onChange();
        }
        else if(this.props.name == "活力組"){

        }
      });
    }
    
    prepare_week_data = (week_index) => {
      var week = window.week_list[week_index];
      if(this.result_div.current.state.has_Searched){
        window.db.doc("data").collection("person").doc(week).collection("response").doc(this.name).get().then((snapshot) => {
          var data = snapshot.data();
          if(data == undefined){
            this.result_div.current.setState({has_Searched: false});
            alert("查無資料");
          }
          else this.result_div.current.prepare_pie_chart_data(data["section_score"]);});
        }
      }

    componentDidUpdate () {
      this.result_div.current.setState({args: []})
    }

    render() {
      return (
        <div className="row-fluid section">
          <div className="block">
            <div className="navbar navbar-inner block-header">
                <div className="muted pull-left">{this.props.name}操練情形</div  >
            </div>
            <Search_div name={this.props.name} search={this.Search} ref={this.search_div}/>
          </div>
          <Block content={Selection} title="周操練情形" args={{options: window.week_list, onChange: this.prepare_week_data}} ref={this.selection}/>
          <Result_div name={this.props.name} ref={this.result_div} args={[]}/>
        </div>
      );
    }

  }

  class Resident_modify extends React.Component {
    
    constructor(props) {
      super(props);
      this.state = {
        orderBy: "group",
      }
      //deepcopy
      this.resident = $.extend(true, {}, window.sysVar.resident);
      this.group = $.extend(true, {}, window.sysVar.group);;
      this.residence = $.extend(true, {}, window.sysVar.residence);; 
      this.question_number = 4;
      this.question = new Array(this.question_number).fill(null).map(() => {return React.createRef()});
      this.form = React.createRef();
    }

    save () {
      if(confirm("確定儲存變更嗎?")){
        window.db.doc("system").update({resident: this.resident, group: this.group, residence: this.residence}).then(() => this.props.alert_success());
        window.sysVar.resident = $.extend(true, {}, this.resident);
        window.sysVar.group = $.extend(true, {}, this.group);
        window.sysVar.residence = $.extend(true, {}, this.residence);
      }
    }

    refresh_group = () => {
      var gender = this.question[1].current.ref.current.value;
      var i;
      for(i = 0;i < this.groups[gender].length;i++){
        this.question[2].current.ref.current.options[i] = new Option(this.groups[gender][i], this.groups[gender][i]);
      }
      this.question[2].current.ref.current.length = i;
    }

    showAddModal = () => {
      var args= [{ref: this.question[0]}, {options: ["弟兄", "姊妹"], onChange: this.refresh_group, ref: this.question[1]}, {options: this.groups["弟兄"], ref: this.question[2]}, {options: Object.keys(this.residence).sort().reverse(), ref: this.question[3]}];
      args.map((arg, i) => {arg["ref"] = this.question[i]; return arg;});
      this.props.showModal("新增住戶", Form, {
        contents: [Input, Selection, Selection, Selection], 
        question: this.question, 
        args: args, 
        labels: ["姓名", "性別", "活力組", "住處"],
        save_button_onClick: this.addResident
      }).then(() => {
        this.question[0].current.setValue("");
        this.question[1].current.setIndex(0);
        this.question[2].current.setIndex(0);
        this.question[3].current.setIndex(0);
      });
    }

    showModifyModal = (name) => {
      this.modified_name = name;
      var old_data = this.resident[name];
      var resident = this.resident;
      this.question_number = 4;
      this.question = new Array(this.question_number).fill(null).map(() => {return React.createRef()});
      var args= [{ref: this.question[0]}, {options: ["弟兄", "姊妹"], onChange: this.refresh_group, ref: this.question[1]}, {options: this.groups[old_data["gender"]], ref: this.question[2]}, {options: Object.keys(this.residence).sort().reverse(), ref: this.question[3]}];
      args.map((arg, i) => {arg["ref"] = this.question[i]; return arg;});
      this.props.showModal("修改住戶資料", Form, {
        contents: [Input, Selection, Selection, Selection], 
        question: this.question, 
        args: args, 
        labels: ["姓名", "性別", "活力組", "住處"],
        save_button_onClick: this.modifyResident
      }).then(() => {
        this.question[0].current.setValue(name);
        this.question[1].current.setIndex(["弟兄", "姊妹"].indexOf(old_data["gender"]));
        this.question[2].current.setIndex(0);
        this.question[3].current.setIndex(Object.keys(this.residence).sort().reverse().indexOf(old_data["residence"]));
      });
    }

    addResident = () => {
      var resident = this.resident;
      var name = this.question[0].current.ref.current.value;
      var gender = this.question[1].current.ref.current.value;
      var group = this.question[2].current.ref.current.value;
      var residence = this.question[3].current.ref.current.value;
      resident[name] = {gender: gender, residence: residence, group: group};
      this.resident = resident;
      this.forceUpdate();
    }

    modifyResident = () => {
      var resident = this.resident;
      delete resident[this.modified_name];
      var name = this.question[0].current.ref.current.value;
      var gender = this.question[1].current.ref.current.value;
      var group = this.question[2].current.ref.current.value;
      var residence = this.question[3].current.ref.current.value;
      resident[name] = {gender: gender, residence: residence, group: group};
      this.resident = resident;
      this.forceUpdate();
    }

    deleteResident = (name) => {
      var resident = this.resident;
      var isDeleted = confirm("確定刪除住戶 " + name + " 嗎?");
      if(isDeleted) {
        this.group[resident[name].group].member.splice(this.group[resident[name].group].member.indexOf(name), 1);
        this.residence[resident[name].residence].member.splice(this.residence[resident[name].residence].member.indexOf(name), 1);
        delete resident[name];
        this.resident = resident;
        this.forceUpdate();
      }
    }

    render() {
      this.subtitles = [{subtitle: "弟兄", index: 0},{subtitle: "姊妹", index: 1}]
      this.groups= {"弟兄": new Set(), "姊妹": new Set()};
      this.data = {"弟兄": {}, "姊妹": {}};
      var resident = this.resident;
      for(var person of Object.keys(resident)){
        var person_data = resident[person];
        this.groups[person_data.gender].add(person_data.group);
        if(this.data[person_data.gender][person_data[this.state.orderBy]] == undefined) this.data[person_data.gender][person_data[this.state.orderBy]] = {};
        var text = "";
        for(var key of Object.keys(person_data).sort()){
          if(key != "token") text += key + ": " + person_data[key] + "\n"; 
        }
        this.data[person_data.gender][person_data[this.state.orderBy]][person] = text;
      }
      for(var key of Object.keys(this.groups)){
        this.groups[key] = Array.from(this.groups[key]);
        this.groups[key].sort();
      }
      return (
        <Block title="住戶名冊修改" content={Toggle_List_Group} isLoad={true} badge={false} args={{
          title: "住戶名冊修改", 
          subtitles: this.subtitles, 
          data: this.data,
          select_bar: true, 
          buttons: true,
          path: '0',
          select_bar_options: ["依活力組排序", "依住處排序"], 
          select_bar_values:["group", "residence"], 
          select_bar_onChange: (x) => {this.setState({orderBy: x})},
          save_button_onClick: () => {this.save()},
          cancel_button_onClick: () => {
            this.resident = Object.assign({}, window.sysVar.resident);
            this.group = Object.assign({}, window.sysVar.group);
            this.residence = Object.assign({}, window.sysVar.residence);
            this.forceUpdate();
          },
          add_button_onClick: () => {this.showAddModal()},
          change_button_onClick: this.showModifyModal,
          delete_button_onClick: this.deleteResident
        }}/>
      );
    }

  }

  class Toggle_List_Group extends React.Component {

    constructor (props) {
      super(props);
      this.selection = React.createRef();
    }

    componentDidMount () {
      $("#" + this.props.path +"_hide_button").hide();
      $("#" + this.props.path).on('hide.bs.collapse', (e) => {
        e.stopPropagation();
        $("#" + this.props.path +"_show_button").toggle();
        $("#" + this.props.path +"_hide_button").toggle();
      }).on('show.bs.collapse', (e) => {
        e.stopPropagation();
        $("#" + this.props.path +"_show_button").toggle();
        $("#" + this.props.path +"_hide_button").toggle();
      })
      if(this.props.draggable){
        $( "ul." + this.props.path +"_sortable" ).sortable({
          group: this.props.path +"_sortable",
          pullPlaceholder: false,
          // animation on drop
          onDrop: function  ($item, container, _super) {
            var $clonedItem = $('<li/>').css({height: 0});
            $item.before($clonedItem);
            $clonedItem.animate({'height': $item.height()});

            $item.animate($clonedItem.position(), function  () {
              $clonedItem.detach();
              _super($item, container);
            });
          },

          // set $item relative to cursor position
          onDragStart: function ($item, container, _super) {
            var offset = $item.offset(),
                pointer = container.rootGroup.pointer;

            adjustment = {
              left: pointer.left - offset.left,
              top: pointer.top - offset.top
            };

            _super($item, container);
          },
          onDrag: function ($item, position) {
            $item.css({
              left: position.left - adjustment.left,
              top: position.top - adjustment.top
            });
          }
        });
      }
    }

    sort_subtitles = (a, b) => {
      return (Number(a.index) > Number(b.index))? 1: -1;
    }

    onChange = (x) => {
      this.props.select_bar_onChange(this.props.select_bar_values[x])
    }

    render () {
      this.content = {};
      var index = 0;
      for(var item of this.props.subtitles){
        this.content[item.subtitle] = [];
        if(this.props.data[item.subtitle].constructor == Object){
          var keys = Object.keys(this.props.data[item.subtitle]).sort();
          var subtitles = [];
          var i = 0;
          for(var key of keys){
            var subtitle_index = (this.props.data[item.subtitle][key].index == undefined)? i: this.props.data[item.subtitle][key].index;
            delete this.props.data[item.subtitle][key].index
            if(Object.keys(this.props.data[item.subtitle][key]).length == 1){
              var first_key = Object.keys(this.props.data[item.subtitle][key])[0];
              this.props.data[item.subtitle][key] = this.props.data[item.subtitle][key][first_key];
            }
            subtitles.push({subtitle: key, index: subtitle_index})
            i++;
          }
          subtitles.sort(this.sort_subtitles);
          this.content[item.subtitle] = React.createElement(Toggle_List_Group, {key: index, subtitles: subtitles, data: this.props.data[item.subtitle], isLoad: true, path: this.props.path + "-" + index, parent: this.props.path + "-", change_button_onClick: this.props.change_button_onClick, delete_button_onClick: this.props.delete_button_onClick, draggable: this.props.draggable});
        }
        else
          this.content[item.subtitle] = React.createElement(Toggle_List_Content, {content: this.props.data[item.subtitle], parent: item.subtitle, path: this.props.path + "-" + index, key: index, change_button_onClick: this.props.change_button_onClick, delete_button_onClick: this.props.delete_button_onClick});
        index++;
      }
      if(!this.props.isLoad) return <Loading pattern="Spinner" />;
      return (
        <div className="block-content collapse in">
          {this.props.select_bar && <Selection  options={this.props.select_bar_options} onChange={this.onChange} ref={this.selection}/>}
          <ul className={"accordion " + ((this.props.draggable)?this.props.path +"_sortable":"")}>
            {this.props.subtitles.map((x, i) => {
              var path = this.props.path + "-" + i;
              return (<li className="card" key={i}>
                        <div className="card-header">
                          <h4 className="mb-0" id={path + "_title"} data-toggle="collapse" data-target={"#" + path} data-parent={"#" + this.props.parent} href={"#" + path} aria-expanded="false" aria-controls={path}>
                            {x.subtitle}
                            <a href="#"><i className="icon-minus" id={path + "_hide_button"} style={{float: "right"}}></i></a>
                            <a href="#"><i className="icon-plus" id={path + "_show_button"} style={{float: "right"}}></i></a>
                          </h4>
                        </div>
                        <div id={path} style={{height: "0px"}} className="collapse">{this.content[x.subtitle]}</div>
                      </li>);
            })}
          </ul>
          {this.props.buttons &&
          <div className="well span11" style={{width: "900"}}>
            <div className="btn-group" style={{float: "left"}}>
              <button className="btn btn-primary" onClick={() => this.props.save_button_onClick()}><i className="icon-file icon-white"></i> 儲存</button>
              <button className="btn btn-danger" onClick={() => this.props.cancel_button_onClick()}><i className="icon-remove icon-white"></i> 取消</button>
            </div>
            <div className="btn-group" style={{float: "right"}}>
              <button className="btn" data-toggle="modal" href="#modal" onClick={() => this.props.add_button_onClick()}><i className="icon-plus"></i> 新增</button>
            </div>
          </div>}
        </div>
      );
    }
    
  }

  class Toggle_List_Content extends React.Component {

    constructor (props) {
      super(props);
    }
    
    componentDidMount () {
      $("#" + this.props.path +"_hide_button").hide();
      $("#" + this.props.path).on('hide.bs.collapse', (e) => {
        e.stopPropagation();
        $("#" + this.props.path +"_show_button").toggle();
        $("#" + this.props.path +"_hide_button").toggle();
      }).on('show.bs.collapse', (e) => {
        e.stopPropagation();
        $("#" + this.props.path +"_show_button").toggle();
        $("#" + this.props.path +"_hide_button").toggle();
      })
    }

    change_button_onClick = () => {
      this.props.change_button_onClick(this.props.parent);
    }

    delete_button_onClick = () => {
      this.props.delete_button_onClick(this.props.parent);
    }

    render () {
      return (
        <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
          <div style={{float: "left"}}>
            <Text content={this.props.content} isLoad={true}/>
          </div>
          <div style={{float: "right"}} className="btn-group">
            <button className="btn btn-primary" data-toggle="modal" href="#modal" onClick={() => this.change_button_onClick()}><i className="icon-pencil icon-white"></i> 修改</button>
            <button className="btn btn-danger" onClick={() => this.delete_button_onClick()}><i className="icon-trash icon-white"></i> 刪除</button>
          </div>
        </div>
      );
    }

  }

  class Form extends React.Component {

    constructor (props) {
      super(props);
    }

    componentDidMount () {
      this.props.question.map((x, i) => {
        x.current.unBlock();
      });
    }

    render () {
      this.content =[]
      for(var i = 0;i < this.props.contents.length;i++){
        var args = this.props.args[i];
        args["key"] = i;
        this.content.push(React.createElement(this.props.contents[i], args));
      }
      return (
        <div className="block-content collapse in">
          <form className="form-horizontal">
            <fieldset>
              {this.content.map((x, i) => {return <div key={i} className="control-group" id={this.props.args[i].group_id}><label className="control-label" htmlFor="focusedInput">{this.props.labels[i]}</label><div className="controls">{x}<span id={this.props.args[i].warning_id} style={{display: "none"}} className="help-inline">{this.props.args[i].warning}</span></div></div>})}
              <div style={{float: "right"}} className="well span12">
                <button className="btn btn-primary" id={this.button_id} data-toggle="modal" href="#modal" onClick={(e) => {e.preventDefault();this.props.save_button_onClick()}}><i className="icon-file icon-white"></i> 完成</button>
              </div>
            </fieldset>
          </form>
        </div>
      );
    }

  }

  class Form_modify extends React.Component {
    
    constructor(props) {
      super(props);
      this.state = {};
      //deepcopy
      this.problem = $.extend(true, {}, window.sysVar.question);
      this.section = $.extend(true, {}, window.sysVar.section);
      this.section_name = Object.keys(this.section).sort((a, b) => {
        return (this.section[a].index > this.section[b].index)? 1: -1;
      });
      this.question_number = 6;
      this.question = new Array(this.question_number).fill(null).map(() => {return React.createRef()});
      this.types = ["MultiChoice", "MultiAnswer", "Grid"];
    }
    
    save () {
      if(confirm("確定儲存變更嗎?")){
        window.db.doc("system").update({question: this.problem, section: this.section}).then(() => this.props.alert_success());
        window.sysVar.question = $.extend(true, {}, this.problem);
        window.sysVar.section = $.extend(true, {}, this.section);
      }
    }

    checkScore = () => {
      var choices_length = this.question[4].current.ref.current.value.split(",").length;
      var scores_length = this.question[5].current.ref.current.value.split(",").length;
      if(choices_length != scores_length){
        $("#分數").addClass("error");
        $("#警告").show()
        $("#save").attr("disabled", "disabled");
      }
      else{
        $("#分數").removeClass("error");
        $("#警告").hide()
        $("#save").removeAttr("disabled");
      }
    }

    type_changed = () => {
      switch(this.question[1].current.ref.current.value){
        case "Grid":
          $(this.question[3].current.ref.current).removeAttr("disabled");
          $(this.question[5].current.ref.current).removeAttr("disabled");
        break;
        case "MultiChoice":
          $(this.question[3].current.ref.current).removeAttr("disabled");
          this.question[5].current.ref.current.value = "";
          $(this.question[5].current.ref.current).attr("disabled", "disabled");
        break;
        case "MultiAnswer":
          this.question[3].current.ref.current.value = "";
          $(this.question[5].current.ref.current).attr("disabled", "disabled");
          $(this.question[5].current.ref.current).removeAttr("disabled");
        break;
      }
    }

    showAddModal = () => {
      var number = [];
      var args= [
        {ref: this.question[0]}, 
        {options: this.section_name, onChange: this.change_section, ref: this.question[1]},
        {options: this.types, ref: this.question[2], onChange: this.type_changed}, 
        {ref: this.question[3], onChange: this.checkScore},
        {ref: this.question[4], onChange: this.checkScore, group_id: "分數", warning: "分數與選項數量不相同", warning_id: "警告"},
        {ref: this.question[5]}
      ];
      args.map((arg, i) => {arg["ref"] = this.question[i]; return arg;});
      this.props.showModal("新增問題", Form, {
        contents: [Input, Selection, Selection, Input, Input, Input], 
        question: this.question, 
        args: args, 
        labels: ["題目", "區塊", "類型", "選項", "分數", "子選項"],
        save_button_onClick: this.addProblem,
        button_id: "save"
      }).then(() => {
        this.question[0].current.setValue("");
        this.question[1].current.setIndex(0);
        this.question[2].current.setIndex(0);
        this.question[3].current.setValue("");
        this.question[4].current.setValue("");
        this.question[5].current.setValue("");
        $(this.question[5].current.ref.current).attr("disabled", "disabled");
      });
    }

    showModifyModal = (title) => {
      var old_data = this.problem[title];
      this.modified_problem = title;
      var args= [
        {ref: this.question[0]}, 
        {options: this.section_name, onChange: this.change_section, ref: this.question[1]},
        {options: this.types, ref: this.question[2], onChange: this.type_changed}, 
        {ref: this.question[3], onChange: this.checkScore},
        {ref: this.question[4], onChange: this.checkScore, group_id: "分數", warning: "分數與選項數量不相同", warning_id: "警告"},
        {ref: this.question[5], className: "disabled"}
      ];
      args.map((arg, i) => {arg["ref"] = this.question[i]; return arg;});
      this.props.showModal("新增問題", Form, {
        contents: [Input, Selection, Selection, Input, Input, Input], 
        question: this.question, 
        args: args, 
        labels: ["題目", "區塊", "類型", "選項", "分數", "子選項"],
        save_button_onClick: this.modifyProblem,
        button_id: "save"
      }).then(() => {
        this.question[0].current.setValue(title);
        this.question[1].current.setIndex(this.section_name.indexOf(old_data.section));
        this.question[2].current.setIndex(this.types.indexOf(old_data["type"]));
        if(old_data["type"] != "MultiAnswer") this.question[3].current.setValue(old_data["選項"]);
        this.question[4].current.setValue(old_data.score);
        if(old_data["type"] != "MultiChoice") this.question[5].current.setValue(old_data["子選項"]);
        this.type_changed();
      });
    }

    addProblem = () => {
      var problem = this.problem;
      var title = this.question[0].current.ref.current.value;
      var section = this.question[1].current.ref.current.value;
      var type = this.question[2].current.ref.current.value
      var choices = this.question[3].current.ref.current.value;
      var scores = this.question[4].current.ref.current.value;
      var subtitles = this.question[5].current.ref.current.value;
      problem.splice(number - 1, 0, {title: title,type: type, "選項": choices.split(","), score: scores.split(","), "子選項": subtitles.split(",")});
      this.problem = problem;
      this.section[section].question.push(title);
      this.forceUpdate();
    }

    modifyProblem = () => {
      var problem = this.problem;
      var old_section = problem[this.modified_problem].section;
      this.section[old_section].question.splice(this.section[old_section].indexOf(this.modified_problem));
      delete problem[this.modified_problem];
      var title = this.question[0].current.ref.current.value;
      var section = this.question[1].current.ref.current.value;
      var type = this.question[2].current.ref.current.value
      var choices = this.question[3].current.ref.current.value;
      var scores = this.question[4].current.ref.current.value;
      var subtitles = this.question[5].current.ref.current.value;
      number--;
      this.problem[title] = {section: section, type: type, "選項": choices, score: scores, "子選項": subtitles};
      this.section[section].question.push(title);
      this.forceUpdate();
    }

    deleteProblem = (title) => {
      var problem = this.problem;
      var isDeleted = confirm("確定刪除問題 " + title + " 嗎?");
      if(isDeleted){
        this.section[problem[title].section].question.splice(this.section[problem[title].section].indexOf(title));
        delete problem[title];
      }
      this.problem = problem;
      this.forceUpdate();
    }

    render() {
      this.data = {};
      this.subtitles = [];
      for(var section of Object.keys(this.section)){
        this.subtitles.push({subtitle: section, index: this.section[section].index});
        this.data[section] = {}
        var i = 0;
        for(var problem of this.section[section].question){
          var score = this.problem[problem]["score"];
          if(Number.isInteger(score)) score = [score]
          else score = score.split(";")
          var data = "題號: " + (i + 1) + "\\n";
          data += "區塊: " + section + "\\n";
          if(this.problem[problem].type != "MultiAnswer") data += "選項: " + this.problem[problem]["選項"] + "\\n";
          data += "分數: " + this.problem[problem]["score"] + "\\n";
          if(this.problem[problem].type != "MultiChoice") data += "子選項: " + this.problem[problem]["子選項"];
          this.data[section][problem] = {};
          this.data[section][problem].data = data;
          this.data[section][problem].index = i;
          i++;
        }
      }
      this.subtitles.sort(this.sort_subtitles);
      return (
        <Block title="表單修改" content={Toggle_List_Group} isLoad={true} badge={false} args={{
          title: "表單修改",
          subtitles: this.section_name,
          data: this.data,
          path: "0",
          select_bar: false,
          buttons: true,
          subtitles:this.subtitles,
          draggable: true,
          sort_function: this.sort_by_number,
          save_button_onClick:() => this.save(),
          cancel_button_onClick:() => {
            this.problem = $.extend(true, [], window.sysVar.problem);
            this.section = $.extend(true, [], window.sysVar.section);
            this.forceUpdate();
          },
          add_button_onClick:() => this.showAddModal(),
          change_button_onClick: this.showModifyModal,
          delete_button_onClick: this.deleteProblem
        }}/>
      );
    }

  }

  class Form_fill extends React.Component {

    constructor (props) {
      super(props);
      this.state = {
        isLoad: false
      }
      this.form = React.createRef();
    }

    componentDidMount(){
      var last_week = week_list[week_list.length - 1];
      google.script.run.withSuccessHandler((res) => {
        if(!res) {
          this.setState({isLoad: true});
          return;
        }
        let index = 0;
        this.form.current.problem_ref.map((i, x) => {
          window.db.doc("data").collection("person").doc(last_week).collection("response")
          .doc(window.account.name).collection("problem").doc(x.current.props.legend)
          .get().then((snapshot)=>{
            if(!snapshot) return;
            x.current.loadValue(snapshot.data());
            index++;
            if(index == this.form.current.problem_ref.length) this.setState({isLoad: true});
          });
        });
      }).last_modify_in_a_week(window.account.name, last_week);
    }

    componentDidUpdate(){
      var last_week = week_list[week_list.length - 1];
      google.script.run.withSuccessHandler((res) => {
        if(!res) {
          this.setState({isLoad: true});
          return;
        }
        let index = 0;
        this.form.current.problem_ref.map((i, x) => {
          window.db.doc("data").collection("person").doc(last_week).collection("response")
          .doc(window.account.name).collection("problem").doc(x.current.props.legend)
          .get().then((snapshot)=>{
            if(!snapshot) return;
            x.current.loadValue(snapshot.data());
            index++;
            if(index == this.form.current.problem_ref.length) this.setState({isLoad: true});
          });
        });
      }).last_modify_in_a_week(window.account.name, last_week);
    }

    render () {
      return <Block content={Problem_Form} args={{finish: true, isLoad: this.state.isLoad}} ref={this.form}/>
    }
  }

  class Form_review extends React.Component {
    
    constructor(props) {
      super(props);
    }
    
    render() {
      return (
        <Block title="預覽表單" content={Problem_Form} args={{isLoad: true}}/>
      );
    }

  }

  class Problem_Form extends React.Component {

    constructor (props) {
      super(props);
      this.section = window.sysVar.section;
      this.section_list = Object.keys(this.section).sort((a, b) => {
        return (this.section[a].index > this.section[b].index)? 1: -1;
      });
      this.problem = window.sysVar.question;
      this.problem_num = Object.keys(this.problem).length;
      this.problem_ref = new Array(this.problem_num).fill(null).map(() => {return React.createRef()});
      this.problem_index = -1;
    }

    componentDidMount () {
      $('#rootwizard').bootstrapWizard({onTabShow: function(tab, navigation, index) {
        var $total = navigation.find('li').length;
        var $current = index+1;
        var $percent = ($current/$total) * 100;
        $('#rootwizard').find('.bar').css({width:$percent+'%'});
        // If it's the last tab then hide the last button and show the finish instead
        if($current >= $total) {
            $('#rootwizard').find('.pager .next').hide();
            $('#rootwizard').find('.pager .finish').show();
            $('#rootwizard').find('.pager .finish').removeClass('disabled');
        } else {
            $('#rootwizard').find('.pager .next').show();
            $('#rootwizard').find('.pager .finish').hide();
        }
      }});
      $('#rootwizard .finish').click(function() {
        alert('已完成填寫');
        $('#rootwizard').find("a[href*='tab1']").trigger('click');
      });
    }

    writeData () {
      //更改 last_modify 時間戳
      google.script.run.touch(window.account.name);
      
      for(var problem of this.problem_ref){
        console.log(problem.current.props.legend, problem.current.getValue());
      }
    }

    render () {
      if(!this.props.isLoad) return <Loading pattern="Spinner" />;
      return (
        <div className="block-content collapse in" id="rootwizard">
          <div className="navbar">
            <div className="navbar-inner">
              <div className="container">
                <ul>
                  {this.section_list.map((x, i) => {
                    return <li key={i}><a href={"#section" + i} data-toggle="tab">{x}</a></li>
                  })}
                </ul>
              </div>
            </div>
          </div>
          <div id="bar" className="progress progress-striped active">
            <div className="bar"></div>
          </div>
          <div className="tab-content">
            {this.section_list.map((x, i) => {
              return (
                <React.Fragment key={i}>
                  <div className="tab-pane" id={"section" + i}>
                    <form className="form-horizontal">
                      {this.section[x].question.map((y, j) => {this.problem_index++;return <Problem key={j} ref={this.problem_ref[this.problem_index]} problem={this.problem[y]} legend={y}/>})}
                    </form>
                  </div>
                </React.Fragment>
              )
            })}
          </div>
          <ul className="pager wizard">
              <li className="previous first" style={{display: "none"}}><a href="#">First</a></li>
              <li className="previous"><a href="#">Previous</a></li>
              <li className="next last" style={{display: "none"}}><a href="#">Last</a></li>
              <li className="next"><a href="#">Next</a></li>
              {this.props.finish && <li className="next finish" style={{display: "none"}} onClick={() => this.writeData()}><a href="#">Finish</a></li>}
          </ul>
        </div>  
      )
    }

  }

  class Problem extends React.Component {

    constructor (props) {
      super(props);
      switch(this.props.problem.type){
        case "MultiAnswer":
          this.type = "checkbox";
          this.row_data = this.props.problem["子選項"].split(";");
          this.col_data = [""];
          this.group = this.props.legend + "col_group";
        break;
        case "MultiChoice":
          this.type = "radio";
          this.row_data = this.props.problem["選項"].split(";");
          this.col_data = [""];
          this.group = this.props.legend + "row_group";
        break;
        case "Grid":
          this.type = "radio";
          this.row_data = this.props.problem["子選項"].split(";");
          this.col_data = this.props.problem["選項"].split(";");
          this.group = this.props.legend + "col_group";
        break;
      }
    }

    getValue () {
      var value = {};
      if(this.group == this.props.legend + "row_group"){
        for(var i = 0;i < this.col_data.length;i++){
          value[this.col_data[i]] = [];
          $("input[name='" + this.group + i + "']").each((index, item) => {
            value[this.col_data[i]].push(item.checked);
          });
        }
      }
      else{
        for(var i = 0;i < this.row_data.length;i++){
          value[this.row_data[i]] = [];
          $("input[name='" + this.group + i + "']").each((index, item) => {
            value[this.row_data[i]].push(item.checked);
          });
        }
      }
      return value;
    }

    loadValue (value) {
      switch(this.props.problem.type){
        case "Grid":
        case "MultiAnswer":
          for(var i = 0;i < this.row_data.length;i++){
            $("input[name='" + this.group + i + "']").each((index, item) => {
              item.checked = value[this.row_data[i]][index];
            });
          }
          break;
        case "MultiChoice":
          for(var i = 0;i < this.col_data.length;i++){
            $("input[name='" + this.group + i + "']").each((index, item) => {
              item.checked = value[this.col_data[i]][index];
            });
          }
          break;
      }
    }

    render () {
      return (
        <fieldset>
          <legend style={{padding: "10px", marginLeft: "10px"}}>{this.props.legend}</legend>
          <div className="wrapper">
            <div className="grid-header" style={{marginLeft: (this.props.problem.type == "MultiAnswer")? "10px":"15px"}}>
              <div className="header-item"></div>
              {this.row_data.map((x, i) => {return <div key={i} className="header-item">{x}</div>})}
            </div>
            {this.col_data && !!this.col_data.length && this.col_data.map((x, i) => {
              return <div className="grid-row"><div className="flex-item" style={{marginLeft: "15px"}}>{x}</div>{this.row_data.map((y, j) => {return <label key={j} className="flex-item"><input type={this.type} name={(this.group.includes("row_group"))? this.group + i: this.group + j} /><span></span></label>})}</div>
            })}
          </div>
        </fieldset>
      );
    }

  }
  
  class Text extends React.Component {

    constructor (props) {
      super(props);
    }

    render () {
      if(!this.props.isLoad) return <Loading pattern="Spinner" />;
      return <div className="block-content collapse in">{this.props.content.split("\\n").map((x, i) => {
        if(i == 0){
          return x.split("\\t").map((y, j) => {
              if(i != 0) return <span key={j}>{'\u00A0\u00A0\u00A0\u00A0'}{y}</span>;
              else return y;
          })
        }
        else{
          return <span key={i}><br />{x.split("\\t").map((y, j) => {
              if(j != 0) return <span key={j}>{'\u00A0\u00A0\u00A0\u00A0'}{y}</span>;
              else return y;
            })
          }</span>}
    })}</div>
    }

  }

  class Schedule extends React.Component {

    constructor (props) {
      super(props);
      this.state = {
        isLoad: false
      }
    }
    
    renderCalendar(events) {
      this.calendarEl = document.getElementById('calendar');
      this.containerEl = document.getElementById('external-events');
      // Easy pie charts
      this.calendar = new FullCalendar.Calendar(this.calendarEl ,{
        plugins: [ 'dayGrid', 'timeGrid', 'list', "interaction" ] ,
        initialView: 'dayGridMonth',
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        droppable: true,
        selectable: true,
        selectMirror: true,
        select: (arg) => {
          this.calendar.unselect();
        },
        eventClick: (arg) => {
          var title = prompt('Event Title:');
          if (title) {
            this.calendar.addEvent({
              title: title,
              start: arg.start,
              end: arg.end,
              allDay: arg.allDay
            });
            arg.event.remove();
          }
          /*if (confirm('Are you sure you want to delete this event?')) {
            arg.event.remove()
          }*/
        },
        editable: true,
        droppable: true,
        dropAccept: ".external-event",
        drop: (arg) => { 
            // is the "remove after drop" checkbox checked?
            if ($('#drop-remove').is(':checked')) {
                // if so, remove the element from the "Draggable Events" list
                arg.draggedEl.parentNode.removeChild(arg.draggedEl);
            }
        },
        eventAdd: () => {
          console.log("Save!")
          var events = this.calendar.getEvents();
          console.log(events);
          window.db.doc("event").collection("events").get().then((docs) => {
            var length = docs.docs.length;
            events.map((x, i) => {
              if(x.key == undefined) {
                x.key = length;
                length++;
              }
              window.db.doc("event").collection("events").doc(x.key).update(x)
            });
          });
        },
        eventChange: () => {
          console.log("Save!")
          var events = this.calendar.getEvents();
          console.log(events);
          window.db.doc("event").collection("events").get().then((docs) => {
            var length = docs.docs.length;
            events.map((x, i) => {
              if(x.key == undefined) {
                x.key = length;
                length++;
              }
              window.db.doc("event").collection("events").doc(x.key).update(x)
            });
          });
        },
        eventRemove: () => {
          console.log("Save!")
          var events = this.calendar.getEvents();
          console.log(events);
          window.db.doc("event").collection("events").get().then((docs) => {
            var length = docs.docs.length;
            events.map((x, i) => {
              if(x.key == undefined) {
                x.key = length;
                length++;
              }
              window.db.doc("event").collection("events").doc(x.key).update(x)
            });
          });
        },
        // US Holidays
        events: events
      });
      this.calendar.render();
      new FullCalendarInteraction.Draggable(this.containerEl, {
        itemSelector: '.external-event',
        eventData: function(eventEl) {
        return {
          title: eventEl.innerText.trim()
        }
      }});
    }

    componentDidMount () {
      this.events = [];
      window.db.doc("event").get().then((snapshot) => {
        this.default_events = snapshot.data()["default_events"];
        window.db.doc("event").collection("events").get().then((docs) => {
          var index = 0;
          docs.forEach((doc) => {
            this.events.push(doc.data());
            index++;
            if(index == docs.docs.length){
              this.setState({isLoad: true});
              this.renderCalendar(this.events);
            }
          });
        });
      });
    }
    
    render () {
      if(!this.state.isLoad) return <Loading pattern="Spinner" />;
      return (
        <div className="block-content collapse in">
          <div className="span2">
            <div id='external-events'>
              <h4>Draggable Events</h4>
              {this.default_events.map((x, i) => <div key={i} className="external-event">{x}</div>)}
              <p>
                <input type='checkbox' id='drop-remove' /> <label htmlFor='drop-remove'>remove after drop</label>
              </p>
            </div>
          </div>
          <div className="span10">
            <div id='calendar'></div>
          </div>
        </div>
        );
    }

  }

  class System_setting extends React.Component {
    
    constructor(props) {
      super(props);
      this.file_upload = React.createRef();
      this.enabled = React.createRef();
    }

    componentDidMount() {}
    
    upload(name){
      var form = this.file_upload.current;
      var item = form[name + "_upload"]
      if(form == null) return;
      //上傳csv檔，若不是csv，跑出錯誤信息
      if(item.files[0].type != "application/vnd.ms-excel"){
            item.parentElement.getElementsByClassName("alert").item(0).classList.remove("hidden");
            form["reset_system_btn"].disabled = true;
            return -1;
      }
      var reader = new FileReader();
      var progressBar = item.parentElement.getElementsByClassName("progress").item(0);
      progressBar.classList.remove("hidden");
      reader.onload = event => {
      // 取得檔案完整內容
        progressBar.classList.add("hidden");
        if(typeof(form[name]) != 'undefined' && form[name] != null){
            form.removeChild(form[name]);
        }
        var input = document.createElement("input");
        input.type = "hidden";
        input.value = event.target.result;
        input.name = name;
        form.appendChild(input);
        var resident = form['resident'];
        var problem = form['problem'];
        //確認是否都有檔案
        if((typeof(resident) != 'undefined' && resident != null) &&
        (typeof(problem) != 'undefined' && problem != null)){
          form["reset_system_btn"].disabled = false;
        }
        else form["reset_system_btn"].disabled = true;
        //console.log(event.target.result);
        };
        reader.onprogress = function (evt) {
        // 確定 evt 是否為 ProgressEvent
        if (evt.lengthComputable) {
          // 計算百分比
          let percentLoaded = Math.round((evt.loaded / evt.total) * 100);
          //更新進度條
          progressBar.style.width = percentLoaded + "%";
          // 注意：這裡的百分比的數字不會到 100
          console.log(percentLoaded);
        }
      };
      var text = reader.readAsText(item.files[0]);      
    }

    reset_system(){
      var check = confirm("確定重置系統嗎?");
      if(!check) return false;
      var form = this.file_upload.current;
      var residents = form['resident'].value.replace("/\\r/gi", "").split("\\n").map((x) => {return x.trim()}).filter(item => item);
      if(residents.length == 1){
        residents = residents[0].split("\u000A")
      }
      var problems = form['problem'].value.replace("/\\r/gi", "").split("\\n").map((x) => {return x.trim()}).filter(item => item);
      if(problems.length == 1){
        problems = problems[0].split("\u000A")
      }
      // prepare resident information
      var groups = residents[0].split(",").map((x) => {return x.trim()}).filter(item => item);
      var group = {};
      for(var g of groups){
        group[g] = {member: []};
      }
      var residences = residents[1].split(",").map((x) => {return x.trim()}).filter(item => item);
      var residence = {};
      for(var r of residences){
        residence[r] = {member: []};
      }
      var resident = {};
      for(var line of residents.slice(2)){
        var info = line.split(",").filter(item => item).map((x) => {return x.trim()});
        var name = info[0];
        resident[name] = {};
        resident[name].gender = info[1];
        resident[name].group = info[2];
        resident[name].residence = info[3];
        if(group[info[2]] == undefined){
          alert("活力組 " + info[2] + " 不存在");
          $("#resident_alert").show();
          $("#reset_btn").click();
          return;
        }
        else group[info[2]].member.push(name);
        if(residence[info[3]] == undefined){
          alert("住處 " + info[3] + " 不存在");
          $("#resident_alert").show();
          $("#reset_btn").click();
          return;
        }
        else residence[info[3]].member.push(name);
      }
      var semester = problems[0].split(",")[0];
      var problem = {};
      var section = {};
      var cur_section = "";
      var section_index = 0;
      // prepare problem information
      for(var line of problems.slice(1)){
        var info = line.split(",").map((x) => {return x.trim()}).filter(item => item);
        if(info[0].includes("B;")){
          cur_section = info[0].replace("/B;/gi", "");
          section[cur_section] = {index: section_index, question: []}
          section_index++;
        }
        else{
          var title = info[0];
          problem[title] = {};
          problem[title].type = info[1];
          if(!["MultiChoice", "MultiAnswer", "Grid"].includes(problem[title].type)){
            alert("問題格式需為 MultiAnswer, MultiChoice, Grid 其中之一");
            $("#problem_alert").show();
            $("#reset_btn").click();
            return;
          }
          problem[title].score = info[3];
          if(problem[title].type != "MultiChoice") problem[title]["子選項"] = info[4];
          if(problem[title].type != "MultiAnswer"){
            problem[title]["選項"] = info[2];
            if(problem[title]["選項"].split(";").length != problem[title].score.split(";").length){
              alert(title + "的分數與選項數量必須一致");
              $("#problem_alert").show();
              $("#reset_btn").click();
              return;
            }
          }
          section[cur_section].question.push(title);
        }
      }
      var confirmed = confirm("即將重置系統, 請再次確認資料是否正確\u000A住戶: " + JSON.stringify(resident, null, 4) + "\u000A活力組: " + JSON.stringify(group, null, 4) + "\u000A住處: " + JSON.stringify(residence, null, 4) + "\u000A問題區塊:" + JSON.stringify(section, null, 4) +"\u000A問題列表: " + JSON.stringify(problem, null, 4));
      if(confirmed){
        window.firestore.collection(semester).doc("system").update({resident: resident, group: group, residence: residence, problem: problem, section: section}).then(() => this.props.alert_success());
      }
    }

    render() {
        var enability = "關閉";
        if(window.sysVar.enabled) enability = "開啟 ";
        return (
          <div>
            <div className="row-fluid">
              <div className="block">
                <div className="navbar navbar-inner block-header">
                  <div className="muted pull-left">系統狀態</div>
                </div>
                <div className="block-content">
                  <div className="btn-group">
                    <button data-toggle="dropdown" className="btn dropdown-toggle">
                      <font ref={this.enabled}>{enability}</font>
                    <span className="caret"></span>
                    </button>
                    <ul className="dropdown-menu">
                      <li><a onClick={() => {if(this.enabled.current.innerHTML != '開啟 '){
                      google.script.run.withSuccessHandler().reboot();
                      this.enabled.current.innerHTML = '開啟 ';
                      this.props.alert_success();
                    }}}  href="#">開啟</a></li>
                      <li><a onClick={ () => {if(this.enabled.current.innerHTML != '關閉 '){
                      google.script.run.withSuccessHandler().shutdown();
                      this.enabled.current.innerHTML = '關閉 ';
                      this.props.alert_success()}}}  href="#">關閉</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="row-fluid">
            <div className="block">
              <div className="navbar navbar-inner block-header">
                <div className="muted pull-left">系統重置</div>
              </div>
              <div className="block-content">                      
                <form ref={this.file_upload} className="form-horizontal" onSubmit={(e) => {e.preventDefault();this.reset_system();}} encType="multipart/form-data" acceptCharset="utf-8">
                  <fieldset>
                    <div className="alert alert-info">
                      <button className="close" data-dismiss="alert">×</button>
                      <strong>Info!</strong> 請確保上傳檔案格式正確無誤，參照 "系統操作指引"
                    </div>
                    <div className="control-group">
                      <label className="control-label" htmlFor="focusedInput">住戶名單</label>
                      <div className="controls">
                        <input type="file" name="resident_upload" onChange={() => this.upload('resident')} accept=".csv" />
                        <div className="progress hidden">
                          <div style={{width: "0%"}}className="bar"></div>
                        </div>
                        <div className="alert alert-error alert-block" style={{display: "none"}} id="resident_alert">
                          <a className="close" data-dismiss="alert">×</a>
                          <h4 className="alert-heading">Error!</h4>
                              檔案格式錯誤
                        </div>
                      </div>
                    </div>
                    <div className="control-group">
                      <label className="control-label" htmlFor="disabledInput">表單問題列表</label>
                      <div className="controls">
                        <input type="file" name="problem_upload" onChange={() => this.upload('problem')} accept=".csv" />
                        <div className="progress hidden">
                          <div style={{width: "0%"}} className="bar"></div>
                        </div>
                        <div className="alert alert-error alert-block"  style={{display: "none"}} id="problem_alert">
                          <a className="close" data-dismiss="alert">×</a>
                          <h4 className="alert-heading">Error!</h4>
                          檔案格式錯誤
                        </div>
                      </div>
                    </div>
                    <div className="form-actions">
                      <button type="submit" name="reset_system_btn" disabled={true} className="btn btn-primary">Reset System</button>
                      <button id="reset_btn" type="reset" className="btn" onClick={() => {var form = this.file_upload.current;form['reset_system_btn'].disabled = true;if(form['resident'] != undefined) form.removeChild(form['resident']);if(form['problem'] != undefined) form.removeChild(form['problem'])}}>Cancel</button>
                    </div>
                  </fieldset>
                </form>
              </div>
            </div>
          </div>
          </div>
        )
      }

  }

  class Calendar extends React.Component {
    
    constructor(props) {
      super(props);
    }
    
    render() {
      return <Block title="Calender" content={Schedule} badge={false} isLoad={false}/>;
    }

  }

  class Instruction extends React.Component {
    
    constructor(props) {
      super(props);
    }
    
    render() {
      return (
        <Block title="系統操作指引" content={Table} badge={false} isLoad={true} args={{col_titles: ["#", "檔名", "備註"], row: [
          [1, <a href="#" onClick={() => {window.open('https://drive.google.com/file/d/1SU8GO9y6RY8fbpDIBssnrmI4OlQIONF5/view?usp=sharing');}}>系統重置指引.pptx</a>, ""],
          [2, <a href="#" onClick={() => {window.open('https://drive.google.com/file/d/1NGHpx3S4mrREsiWHTiDxydYl8PlhFeZC/view?usp=sharing');}}>住戶名冊範例.csv</a>, ""],
          [3, <a href="#" onClick={() => {window.open('https://drive.google.com/file/d/1l4z73hhjBEmSqFYdL6i5WGdrrlzaRy4U/view?usp=sharing');}}>問題清單格式.xlsx</a>, ""],
          [4, <a href="#" onClick={() => {window.open('https://drive.google.com/file/d/18tv6CODbT-IUhnXpRRWZ1agkNRaycyiN/view?usp=sharing');}}>問題清單範例.csv</a>, ""]
        ]}}/>
      );
    }

  }

  class Contact extends React.Component {
    
    constructor(props) {
      super(props);
      this.state = {
        isLoad: false
      }
    }

    componentDidMount () {
      this.contact = window.manage_information["聯絡管理員"];
      this.version = window.manage_information["版本號"];
      this.setState({isLoad: true});
    }
    
    render() {
      return (
        <div>
          <Block title="聯絡管理員" badge={false} content={Text} isLoad={this.state.isLoad} args={{content: this.contact, isLoad: this.state.isLoad}}/>
          <Block title="版本號" badge={false} content={Text} isLoad={this.state.isLoad} args={{content: this.version, isLoad: this.state.isLoad}}/>
        </div>
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
          <img src={this.urls[this.props.pattern]} style={{display:"block", margin:"auto"}} />
        </div>
      )
    }

  }

  class Frame extends React.Component {

    constructor(props) {
      super(props);
      this.state = {};
      this.change_buttom = this.change_buttom.bind(this);
      this.page = {
        'Announcement': React.createRef(),
        'Summary': React.createRef(),
        '活力組': React.createRef(),
        '個人': React.createRef(),
        'Resident_modify': React.createRef(),
        'Form_modify': React.createRef(),
        'Form_review': React.createRef(),
        'System_setting': React.createRef(),
        'Calendar': React.createRef(),
        'Instruction': React.createRef(),
        'Contact': React.createRef()
      }
      this.main = React.createRef();
      this.banner_success = React.createRef();
      this.alert_success = this.alert_success.bind(this);
      this.modal = React.createRef();
    }

    componentDidMount () {
      this.setState({showModal: this.modal.current.renderModal});
    }
    
    change_buttom = (old_page, new_page) => {
      this.page[old_page].current.classList.remove("active");
      this.page[new_page].current.classList.add("active");
    }
    
    alert_success = () => {
      if(this.banner_success.current.classList.contains("hidden")) this.banner_success.current.classList.remove("hidden");
      else this.banner_success.current.classList.add("hidden")
    }

    render() {
      return (
      <div className="container-fluid">
        <div className="row-fluid">
          <div className="span3" id="sidebar">
            <ul className="nav nav-list bs-docs-sidenav nav-collapse collapse">
              <li ref={this.page['Announcement']}  className="active">
                  <a href="#" onClick={() => this.main.current.setState({page: 'Announcement'})} ><i className="icon-chevron-right"></i> 公告</a>
              </li>
              <li ref={this.page['Summary']}>
                  <a href="#" onClick={() => this.main.current.setState({page: 'Summary'})}><i className="icon-chevron-right"></i> 總覽</a>
              </li>
              <li ref={this.page["活力組"]}>
                  <a href="#" onClick={() => this.main.current.setState({page: '活力組'})}><i className="icon-chevron-right"></i> 活力組操練情形</a>
              </li>
              <li ref={this.page["個人"]}>
                  <a href="#" onClick={() => this.main.current.setState({page: '個人'})}><i className="icon-chevron-right"></i> 個人操練情形</a>
              </li>
              <li ref={this.page["Resident_modify"]}>
                  <a href="#" onClick={() => this.main.current.setState({page: 'Resident_modify'})}><i className="icon-chevron-right"></i> 修改住戶名冊</a>
              </li>
              <li ref={this.page["Form_modify"]}>
                  <a href="#" onClick={() => this.main.current.setState({page: 'Form_modify'})}><i className="icon-chevron-right"></i> 修改表單</a>
              </li>
              <li ref={this.page["Form_review"]}>
                  <a href="#" onClick={() => this.main.current.setState({page: 'Form_review'})}><i className="icon-chevron-right"></i> 表單預覽</a>
              </li>
              <li ref={this.page["System_setting"]}>
                  <a href="#" onClick={() => this.main.current.setState({page: 'System_setting'})}><i className="icon-chevron-right"></i> 系統設定</a>
              </li>
              <li ref={this.page["Calendar"]}>
                  <a href="#" onClick={() => this.main.current.setState({page: 'Calendar'})}><i className="icon-chevron-right"></i> 行事曆</a>
              </li>
              <li ref={this.page["Instruction"]}>
                  <a href="#" onClick={() => this.main.current.setState({page: 'Instruction'})}><i className="icon-chevron-right"></i> 系統操作指引</a>
              </li>
              <li ref={this.page["Contact"]}>
                  <a href="#" onClick={() => this.main.current.setState({page: 'Contact'})}><i className="icon-chevron-right"></i> 聯絡管理員</a>
              </li>
            </ul>
          </div>
          <div className="span9" id="content">
            <div className="row-fluid">
              <div className="alert alert-success hidden" ref={this.banner_success}>
                  <button type="button" className="close" data-dismiss="alert">&times;</button>
                  <h4>Success</h4>
                  The operation completed successfully
              </div>
              <div className="navbar">
                <div className="navbar-inner">
                  <ul className="breadcrumb">
                      <i className="icon-chevron-left hide-sidebar"><a href='#' title="Hide Sidebar" rel='tooltip'>&nbsp;</a></i>
                      <i className="icon-chevron-right show-sidebar" style={{display:'none'}}><a href='#' title="Show Sidebar" rel='tooltip'>&nbsp;</a></i>
                      <li>
                          <a href="#">Dashboard</a> <span className="divider">/</span>	
                      </li>
                      <li>
                          <a href="#">Settings</a> <span className="divider">/</span>	
                      </li>
                      <li className="active">Tools</li>
                  </ul>
                </div>
              </div>
            </div>
            <Main change_buttom={this.change_buttom} ref={this.main} alert_success={this.alert_success} showModal={this.state.showModal}/>
            <Modal ref={this.modal}/>
            <hr />
            <footer>
                <p>&copy; Vincent Gabriel 2013</p>
            </footer>
            </div>
        </div>
      </div>
      )
    }
  }
  
  class Admin_Frame extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.change_buttom = this.change_buttom.bind(this);
      this.page = {
        'Announcement': React.createRef(),
        'Summary': React.createRef(),
        '活力組': React.createRef(),
        '個人': React.createRef(),
        'Resident_modify': React.createRef(),
        'Form_modify': React.createRef(),
        'Form_review': React.createRef(),
        'System_setting': React.createRef(),
        'Calendar': React.createRef(),
        'Instruction': React.createRef(),
        'Contact': React.createRef()
      }
      this.main = React.createRef();
      this.banner_success = React.createRef();
      this.alert_success = this.alert_success.bind(this);
      this.modal = React.createRef();
      this.database_url = "https://exercising-table-data-default-rtdb.firebaseio.com";
    }

    componentDidMount () {
      this.setState({showModal: this.modal.current.renderModal});
    }
    
    change_buttom = (old_page, new_page) => {
      this.page[old_page].current.classList.remove("active");
      this.page[new_page].current.classList.add("active");
    }
    
    alert_success = () => {
      if(this.banner_success.current.classList.contains("hidden")) this.banner_success.current.classList.remove("hidden");
      else this.banner_success.current.classList.add("hidden")
    }

    render() {
      return (
      <div className="container-fluid">
        <div className="row-fluid">
          <div className="span3" id="sidebar">
            <ul className="nav nav-list bs-docs-sidenav nav-collapse collapse">
              <li ref={this.page['Announcement']}  className="active">
                  <a href="#" onClick={() => alert("此功能開發中，敬請期待")} ><i className="icon-chevron-right"></i> 發布公告</a>
              </li>
              <li ref={this.page['Summary']}>
                  <a href="#" onClick={() => this.main.current.setState({page: 'Summary'})}><i className="icon-chevron-right"></i> 總覽</a>
              </li>
              <li ref={this.page["活力組"]}>
                  <a href="#" onClick={() => this.main.current.setState({page: '活力組'})}><i className="icon-chevron-right"></i> 活力組操練情形</a>
              </li>
              <li ref={this.page["個人"]}>
                  <a href="#" onClick={() => this.main.current.setState({page: '個人'})}><i className="icon-chevron-right"></i> 個人操練情形</a>
              </li>
              <li ref={this.page["Resident_modify"]}>
                  <a href="#" onClick={() => this.main.current.setState({page: 'Resident_modify'})}><i className="icon-chevron-right"></i> 修改住戶名冊</a>
              </li>
              <li ref={this.page["Form_modify"]}>
                  <a href="#" onClick={() => this.main.current.setState({page: 'Form_modify'})}><i className="icon-chevron-right"></i> 修改表單</a>
              </li>
              <li ref={this.page["Form_review"]}>
                  <a href="#" onClick={() => this.main.current.setState({page: 'Form_review'})}><i className="icon-chevron-right"></i> 表單預覽</a>
              </li>
              <li ref={this.page["System_setting"]}>
                  <a href="#" onClick={() => this.main.current.setState({page: 'System_setting'})}><i className="icon-chevron-right"></i> 系統設定</a>
              </li>
              <li ref={this.page["Calendar"]}>
                  <a href="#" onClick={() => this.main.current.setState({page: 'Calendar'})}><i className="icon-chevron-right"></i> 行事曆</a>
              </li>
              <li ref={this.page["Instruction"]}>
                  <a href="#" onClick={() => alert("此功能開發中，敬請期待")}><i className="icon-chevron-right"></i> 更新系統操作指引</a>
              </li>
              <li ref={this.page["Contact"]}>
                  <a href="#" onClick={() => this.main.current.setState({page: 'Contact'})}><i className="icon-chevron-right"></i> 聯絡管理員</a>
              </li>
            </ul>
          </div>
          <div className="span9" id="content">
            <div className="row-fluid">
              <div className="alert alert-success hidden" ref={this.banner_success}>
                  <button type="button" className="close" data-dismiss="alert">&times;</button>
                  <h4>Success</h4>
                  The operation completed successfully
              </div>
              <div className="navbar">
                <div className="navbar-inner">
                  <ul className="breadcrumb">
                      <i className="icon-chevron-left hide-sidebar"><a href='#' title="Hide Sidebar" rel='tooltip'>&nbsp;</a></i>
                      <i className="icon-chevron-right show-sidebar" style={{display:'none'}}><a href='#' title="Show Sidebar" rel='tooltip'>&nbsp;</a></i>
                      <li>
                          <a href="#">Dashboard</a> <span className="divider">/</span>	
                      </li>
                      <li>
                          <a href="#">Settings</a> <span className="divider">/</span>	
                      </li>
                      <li className="active">Tools</li>
                  </ul>
                </div>
              </div>
            </div>
            <Main change_buttom={this.change_buttom} ref={this.main} alert_success={this.alert_success} showModal={this.state.showModal}/>
            <Modal ref={this.modal}/>
            <hr />
            <footer>
                <p>&copy; Vincent Gabriel 2013</p>
            </footer>
            </div>
        </div>
      </div>
      )
    }
    }

  class User_Frame extends React.Component {

    constructor(props) {
      super(props);
      this.state = {};
      this.change_buttom = this.change_buttom.bind(this);
      this.page = {
        'Announcement': React.createRef(),
        '活力組': React.createRef(),
        '個人': React.createRef(),
        'Form_fill': React.createRef(),
        'Calendar': React.createRef(),
        'FAQ': React.createRef(),
        'Contact': React.createRef()
      }
      this.main = React.createRef();
      this.banner_success = React.createRef();
      this.alert_success = this.alert_success.bind(this);
      this.modal = React.createRef();
    }

    componentDidMount () {
      this.setState({showModal: this.modal.current.renderModal});
    }

    change_buttom = (old_page, new_page) => {
      this.page[old_page].current.classList.remove("active");
      this.page[new_page].current.classList.add("active");
    }

    alert_success = () => {
      if(this.banner_success.current.classList.contains("hidden")) this.banner_success.current.classList.remove("hidden");
      else this.banner_success.current.classList.add("hidden")
    }

    render() {
      return (
      <div className="container-fluid">
        <div className="row-fluid">
          <div className="span3" id="sidebar">
            <ul className="nav nav-list bs-docs-sidenav nav-collapse collapse">
              <li ref={this.page['Announcement']}  className="active">
                  <a href="#" onClick={() => this.main.current.setState({page: 'Announcement'})} ><i className="icon-chevron-right"></i> 公告</a>
              </li>
              <li ref={this.page["活力組"]}>
                  <a href="#" onClick={() => alert("此功能開發中，敬請期待")}><i className="icon-chevron-right"></i> 活力組操練情形</a>
              </li>
              <li ref={this.page["個人"]}>
                  <a href="#" onClick={() => alert("此功能開發中，敬請期待")}><i className="icon-chevron-right"></i> 個人操練情形</a>
              </li>
              <li ref={this.page["Form_fill"]}>
                  <a href="#" onClick={() => this.main.current.setState({page: 'Form_fill'})}><i className="icon-chevron-right"></i> 表單填寫</a>
              </li>
              <li ref={this.page["Calendar"]}>
                  <a href="#" onClick={() => this.main.current.setState({page: 'Calendar'})}><i className="icon-chevron-right"></i> 行事曆</a>
              </li>
              <li ref={this.page["FAQ"]}>
                  <a href="#" onClick={() => alert("此功能開發中，敬請期待")}><i className="icon-chevron-right"></i> 常見問答</a>
              </li>
              <li ref={this.page["Contact"]}>
                  <a href="#" onClick={() => this.main.current.setState({page: 'Contact'})}><i className="icon-chevron-right"></i> 聯絡管理員</a>
              </li>
            </ul>
          </div>
          <div className="span9" id="content">
            <div className="row-fluid">
              <div className="alert alert-success hidden" ref={this.banner_success}>
                  <button type="button" className="close" data-dismiss="alert">&times;</button>
                  <h4>Success</h4>
                  The operation completed successfully
              </div>
              <div className="navbar">
                <div className="navbar-inner">
                  <ul className="breadcrumb">
                      <i className="icon-chevron-left hide-sidebar"><a href='#' title="Hide Sidebar" rel='tooltip'>&nbsp;</a></i>
                      <i className="icon-chevron-right show-sidebar" style={{display:'none'}}><a href='#' title="Show Sidebar" rel='tooltip'>&nbsp;</a></i>
                      <li>
                          <a href="#">Dashboard</a> <span className="divider">/</span>	
                      </li>
                      <li>
                          <a href="#">Settings</a> <span className="divider">/</span>	
                      </li>
                      <li className="active">Tools</li>
                  </ul>
                </div>
              </div>
            </div>
            <Main change_buttom={this.change_buttom} ref={this.main} alert_success={this.alert_success} showModal={this.state.showModal}/>
            <Modal ref={this.modal}/>
            <hr />
            <footer>
                <p>&copy; Vincent Gabriel 2013</p>
            </footer>
            </div>
        </div>
      </div>
      )
    }

  }

  class Main extends React.Component {
    
    constructor(props) {
      super(props);
      this.old_page = "Announcement";
      this.state = {
        page: "Announcement"
      };
      this.page_map = {
        'Announcement': Announcement,
        'Summary': Summary,
        '活力組': Search_Result_Pair,
        '個人': Search_Result_Pair,
        'Resident_modify': Resident_modify,
        'Form_modify': Form_modify,
        'Form_review': Form_review,
        "Form_fill": Form_fill,
        'System_setting': System_setting,
        'Calendar': Calendar,
        'Instruction': Instruction,
        'Contact': Contact
      }
    }

    render() {
      if(this.old_page != this.state.page) {
        this.props.change_buttom(this.old_page, this.state.page);
        this.old_page = this.state.page;
      }
      return React.createElement(this.page_map[this.state.page], {alert_success: this.props.alert_success, sysVar: this.sysVar, name: this.state.page, showModal: this.props.showModal});
    }
    
  }

  class Modal extends React.Component {

    constructor (props) {
      super(props);
      this.state = {
        title: "",
        content: Text
      }
    }

    renderModal = (title, content, args) => {
      this.setState({title: title, content: content, args: args});
      return Promise.resolve();
    }

    render () {
      return (
        <div id="modal" className="modal hide" aria-hidden="true" style={{display: "none"}} height="700px">
          <div className="modal-header" height="120px">
            <button data-dismiss="modal" className="close" type="button">×</button>
            <h2>{React.createElement(Modal_title , {title: this.state.title})}</h2>
          </div>
          <div className="modal-body" height="400px">
            {React.createElement(this.state.content, this.state.args)}
          </div>
        </div>
      );
    }
    
  }

  class Modal_title extends React.Component {
   
    constructor(props) {
      super(props);
      this.profile_img = "//drive.google.com/uc?id=1pXA88rpJDrqwzKBe0moeu1qutgPv7Raa&export=download";
    }
    render () {
      return <span><img src={this.profile_img} className="square" style={{borderRadius: "50%", border: "1px solid rgba(255,0,0,1.00)"}} />{this.props.title}</span>
    }
  }

export { Index }