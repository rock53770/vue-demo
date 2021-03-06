
export default function (url, data, cbName, fn){
  data[cbName]='jsonp'+Math.random();
  data[cbName]=data[cbName].replace('.', '');
  
  var arr=[];
  for(var i in data)
  {
    arr.push(i+'='+encodeURIComponent(data[i]));
  }
  var str=arr.join('&');
  
  window[data[cbName]]=function (json)
  {
    fn(json);
    
    oHead.removeChild(oS);
    window[data[cbName]]=null;
  };
  var oS=document.createElement('script');
  oS.src=url+'?'+str;
  
  var oHead=document.getElementsByTagName('head')[0];
  oHead.appendChild(oS);
}
