import wv from './base';
export default wv;

//这么定义完全是为了从原来的方法实现中复制过来不用改动，没其它意义
let _listenBridge = wv._listenBridge;
let _callHandler = wv._callHandler;
let _parseData = wv._parseData;
let _regRandomFn = wv._regRandomFn;

//对wv实现进行扩展
Object.assign(wv, {

})