/**
 * Define PVs
 */
var pvs={
  leds:[
		{ pvname: "may:led0" }, { pvname: "may:led1" }, { pvname: "may:led2" },
		{ pvname: "may:led3" }, { pvname: "may:led4" }, { pvname: "may:led5" }]
}


// var pvs={ai:[{pvname:"EVMN-GDRM:DoseRate001"},{pvname:"EVMN-GDRM:DoseRate002"},{pvname:"EVMN-GDRM:DoseRate003"},{pvname:"EVMN-GDRM:DoseRate004"},{pvname:"EVMN-GDRM:DoseRate005"},{pvname:"ARMS-GDRM:GDoseRate001"}],
// ao:[{pvname:"hanlfHost:ao1"}, {pvname:"hanlfHost:ao2"}, {pvname:"hanlfHost:ao3"}]
// }

/**
 * Socket Events for change of value  or severity
 * 监听变量值的变化或报警状态的变化
 *  */
var io = require('socket.io')(server);
io.on('connection', function (socket) {
  
  connect_pvs(pvs.leds,function(err,results){
    async.map(results,function(item,callback){
      item.on("value", function(data) {
      // console.log('Value:',item.pvName,data);
      socket.emit(item.pvName, data);
      console.log(item.pvName+" value change socket event emit");
      });  
    })
  });
  
  connect_pvs_SEVR(pvs.leds,function(err,results){
    async.map(results,function(item,callback){
      item.on("value", function(data) {
      console.log('Value:',item.pvName,data);
      socket.emit(item.pvName, data);
      console.log(item.pvName+" severity change socket event emit")
      });  
    })
  });
 
  /////////////////////////////////////////////////////////////////////////////////////////////////
    connect_pvs(pvs.ao,function(err,results){
      async.map(results,function(item,callback){
        item.on("value", function(data) {
        console.log('Value:',item.pvName,data);
        socket.emit(item.pvName, data);
        console.log(item.pvName+" value change socket event emit")
         });  
        })
    });
  
      connect_pvs_SEVR(pvs.ao,function(err,results){
      async.map(results,function(item,callback){
        item.on("value", function(data) {
        console.log('Value:',item.pvName,data);
        socket.emit(item.pvName, data);
        console.log(item.pvName+" value change socket event emit")
         });  
        })
   });


  /**
   *  监测AO :客户端的变量设定
   *  Monitor AO : configure from the web client;
   */
    connect_pvs(pvs.ao,function(err,results){
      async.map(results,function(item,callback){
        socket.on(item.pvName, function(data) {
        console.log('Value:',item.pvName,data);
        item.put(item.pvName, data);
        console.log(item.pvName+"Set pv value from web client  ")
         });  
        })
    });
  
   });


/**
 * PV创建并监听异步回调 
 */
async= require('async');

function connect_pvs(pvs,callback){
    async.map(pvs, function(item, callback) {
        // console.log(item.pvname+" is connect*");
       var pv = new epics.Channel(item.pvname);
       pv.connect(function(err) {
       if(pv.state()){
          pv.monitor()};
          callback(null,pv);
          console.log(item.pvname+" is connected*");
      });
    }, function(err,results){
         callback(err,results); 
  });
};

function connect_pvs_SEVR(pvs,callback){
    async.map(pvs, function(item, callback) {
        // console.log(item.pvname+" is connect*");
       var pv = new epics.Channel(item.pvname+".SEVR");
       pv.connect(function(err) {
       if(pv.state()){
          pv.monitor()};
          callback(null,pv);
          console.log(item.pvname+"alarm severity is monitored*");
      });
    }, function(err,results){
         callback(err,results); 
  });
};

module.exports = app;