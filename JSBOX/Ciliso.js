
class Ciliso{
  constructor(){
    this.page = 1;
    this.query = "";
  }
  
  get_data(){
    return {
      query:this.query,
      page:this.page
    }
  }
  get_next_page(){
    this.page++;
  }
  
  query_changed(query){
    this.page = 1;
    this.query = query;
    console.log(this.query)
  }
}

var app = new Ciliso();

  $ui.render({
    props: {
      title: "磁力搜索引擎"
    },
    views: [
      {
        type: "input",
        props: {
          placeholder: "输入关键字"
        },
        layout: function(make) {
          make.top.left.right.inset(10);
          make.height.equalTo(32);
        },
        events: {
          returned: function(sender) {
            app.query_changed(sender.text)
            fetchData(app);
            //$("list").data = app.data
            sender.blur();
            //sender.text = "";
          }
        }
      },
      {
        type: "list",
        props: {
          id: "list",
          //rowHeight: 100,
          template: {
            props: {
              bgcolor: $color("clear")
            },
            views: [
              {
                type: "label",
                props: {
                  id: "label",
                  //bgcolor: $color("#474b51"),
                  //textColor: $color("#abb2bf"),
                  //align: $align.center,
                  font: $font(12),
                  line:0
                },
                layout: $layout.fill
              }
            ]
          }
        },
        layout: function(make) {
          make.left.bottom.right.equalTo(0);
          make.top.equalTo($("input").bottom).offset(10);
        },
        events: {
          didSelect: function(sender, indexPath, data) {
            console.log(data.hash)
            $clipboard.text="magnet:?xt=urn:btih:"+data.hash;
            $device.taptic(1);
            if(!$app.openURL("wky://")){
              
              $ui.toast("磁力链接已复制");
            }
          },
          didReachBottom:function(sender){
            sender.endFetchingMore();
            app.get_next_page();
            fetchData(app);
            //$("list").data = app.data;
          }
        }
      }
    ]
  });



function fetchData(app){  
  //page = page || 1;
  
  //var torrents;
  var {query,page} = app.get_data();
  query=$text.URLEncode(query);
  //http://www.clb.biz/s/百度网盘_rel_2.html
  //console.log(`https://69cili.xyz/search-${query}-1-0-${page}.html`);
  //`https://69cili.xyz/search-${query}-1-0-${page}.html`
  $http.get({
    url: `http://www.clb.biz/s/${query}_rel_${page}.html`,
    handler: function(resp) {
      var data = resp.data;
      var respcode = resp.response.statusCode;
      //console.info(respcode)
      //var err = resp.error;
      console.info(resp.response.headers)
      if(respcode==500){
        $ui.toast("服务器错误")
        return
      }
      console.log(data)
      let torrents = page==1?[]:$("list").data
      //console.log([1,2,3].concat([3,4,5]))
      const res = data.match(/\/detail.*?<\/a>?/g).map((i)=>{
        return {          
          "label":{
            "text":i.match(/blank">(.*?)<\/a>/)[1].replace(/<\/?em.*?>/g,"")
          },
          "hash":i.match(/detail\/(.*?).html/)[1],
        }
      })
      torrents = torrents.concat(res)
      console.log(torrents)
      $("list").data = torrents
      //listView.data=torrents;
    }
  });
  
};



