import Vue from 'vue';
Vue.filter('currency', function(value, _currency, decimals) {
    value = parseFloat(value);
    if (!isFinite(value) || !value && value !== 0) return '';
    _currency = _currency != null ? _currency : '$';
    decimals = decimals != null ? decimals : 2;
    var stringified = Math.abs(value).toFixed(decimals);
    var _int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
    var i = _int.length % 3;
    var head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : '';
    var _float = decimals ? stringified.slice(-1 - decimals) : '';
    var sign = value < 0 ? '-' : '';
    var digitsRE = /(\d{3})(?=\d)/g;
    return _currency + sign + head + _int.slice(i).replace(digitsRE, '$1,') + _float;
});
//新增数字截取方法(不四舍五入,小数点后位数不足补0) added by lws 20181029
Vue.filter('currency2', function(value = 0, _currency = '', decimals = 2) {
    value = value?value+"":"0";
    decimals = parseFloat(decimals);
    let len = value.length;
    let dot = value.indexOf('.');
    if(!value && value!=0){
      return "0.00";
    }
    if(dot < 0){//无小数点补0
        value=value+'.';
        for(var i = 0;i<decimals;i++){
            value+='0';
        }
        return value = _currency+value.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }
    if(len<=dot+decimals){//位数不足补0
        for(;len<=dot+decimals;len++){
            value+='0';
        }
        return value = _currency+value.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
    }
    if(dot>3){//需要千分位符 , 
      value= value.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      dot = value.indexOf('.');
    }
    return _currency+value.substr(0,dot+decimals+1); 

});
Vue.filter('dataFormat', function (value, fmt) {
  if(isNaN(parseInt(value))){
    return value;
  }
  let getDate = new Date(parseInt(value));
  let o = {
    'M+': getDate.getMonth() + 1,
    'd+': getDate.getDate(),
    'h+': getDate.getHours(),
    'm+': getDate.getMinutes(),
    's+': getDate.getSeconds(),
    'q+': Math.floor((getDate.getMonth() + 3) / 3),
    'S': getDate.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt;
});
