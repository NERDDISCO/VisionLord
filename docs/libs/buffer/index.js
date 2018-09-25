(function(f){if("object"===typeof exports&&"undefined"!==typeof module){module.exports=f()}else if("function"===typeof define&&define.amd){define([],f)}else{var g;if("undefined"!==typeof window){g=window}else if("undefined"!==typeof global){g=global}else if("undefined"!==typeof self){g=self}else{g=this}g.buffer=f()}})(function(){var _Mathfloor=Math.floor,_Mathpow=Math.pow;return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){"use strict";exports.byteLength=function(b64){return 3*b64.length/4-placeHoldersCount(b64)};exports.toByteArray=toByteArray;exports.fromByteArray=fromByteArray;for(var lookup=[],revLookup=[],Arr="undefined"!==typeof Uint8Array?Uint8Array:Array,code="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",i=0,len=code.length;i<len;++i){lookup[i]=code[i];revLookup[code.charCodeAt(i)]=i}revLookup["-".charCodeAt(0)]=62;revLookup["_".charCodeAt(0)]=63;function placeHoldersCount(b64){var len=b64.length;if(0<len%4){throw new Error("Invalid string. Length must be a multiple of 4")}return"="===b64[len-2]?2:"="===b64[len-1]?1:0}function toByteArray(b64){var i,j,l,tmp,placeHolders,arr,len=b64.length;placeHolders=placeHoldersCount(b64);arr=new Arr(3*len/4-placeHolders);l=0<placeHolders?len-4:len;var L=0;for(i=0,j=0;i<l;i+=4,j+=3){tmp=revLookup[b64.charCodeAt(i)]<<18|revLookup[b64.charCodeAt(i+1)]<<12|revLookup[b64.charCodeAt(i+2)]<<6|revLookup[b64.charCodeAt(i+3)];arr[L++]=255&tmp>>16;arr[L++]=255&tmp>>8;arr[L++]=255&tmp}if(2===placeHolders){tmp=revLookup[b64.charCodeAt(i)]<<2|revLookup[b64.charCodeAt(i+1)]>>4;arr[L++]=255&tmp}else if(1===placeHolders){tmp=revLookup[b64.charCodeAt(i)]<<10|revLookup[b64.charCodeAt(i+1)]<<4|revLookup[b64.charCodeAt(i+2)]>>2;arr[L++]=255&tmp>>8;arr[L++]=255&tmp}return arr}function tripletToBase64(num){return lookup[63&num>>18]+lookup[63&num>>12]+lookup[63&num>>6]+lookup[63&num]}function encodeChunk(uint8,start,end){for(var tmp,output=[],i=start;i<end;i+=3){tmp=(uint8[i]<<16)+(uint8[i+1]<<8)+uint8[i+2];output.push(tripletToBase64(tmp))}return output.join("")}function fromByteArray(uint8){for(var tmp,len=uint8.length,extraBytes=len%3,output="",parts=[],maxChunkLength=16383,i=0,len2=len-extraBytes;i<len2;i+=maxChunkLength){parts.push(encodeChunk(uint8,i,i+maxChunkLength>len2?len2:i+maxChunkLength))}if(1===extraBytes){tmp=uint8[len-1];output+=lookup[tmp>>2];output+=lookup[63&tmp<<4];output+="=="}else if(2===extraBytes){tmp=(uint8[len-2]<<8)+uint8[len-1];output+=lookup[tmp>>10];output+=lookup[63&tmp>>4];output+=lookup[63&tmp<<2];output+="="}parts.push(output);return parts.join("")}},{}],2:[function(require,module,exports){exports.read=function(buffer,offset,isLE,mLen,nBytes){var e,m,eLen=8*nBytes-mLen-1,eMax=(1<<eLen)-1,eBias=eMax>>1,nBits=-7,i=isLE?nBytes-1:0,d=isLE?-1:1,s=buffer[offset+i];i+=d;e=s&(1<<-nBits)-1;s>>=-nBits;nBits+=eLen;for(;0<nBits;e=256*e+buffer[offset+i],i+=d,nBits-=8){}m=e&(1<<-nBits)-1;e>>=-nBits;nBits+=mLen;for(;0<nBits;m=256*m+buffer[offset+i],i+=d,nBits-=8){}if(0===e){e=1-eBias}else if(e===eMax){return m?NaN:(s?-1:1)*(1/0)}else{m=m+_Mathpow(2,mLen);e=e-eBias}return(s?-1:1)*m*_Mathpow(2,e-mLen)};exports.write=function(buffer,value,offset,isLE,mLen,nBytes){var e,m,c,eLen=8*nBytes-mLen-1,eMax=(1<<eLen)-1,eBias=eMax>>1,rt=23===mLen?5.960464477539063e-8-6.617444900424222e-24:0,i=isLE?0:nBytes-1,d=isLE?1:-1,s=0>value||0===value&&0>1/value?1:0;value=Math.abs(value);if(isNaN(value)||value===1/0){m=isNaN(value)?1:0;e=eMax}else{e=_Mathfloor(Math.log(value)/Math.LN2);if(1>value*(c=_Mathpow(2,-e))){e--;c*=2}if(1<=e+eBias){value+=rt/c}else{value+=rt*_Mathpow(2,1-eBias)}if(2<=value*c){e++;c/=2}if(e+eBias>=eMax){m=0;e=eMax}else if(1<=e+eBias){m=(value*c-1)*_Mathpow(2,mLen);e=e+eBias}else{m=value*_Mathpow(2,eBias-1)*_Mathpow(2,mLen);e=0}}for(;8<=mLen;buffer[offset+i]=255&m,i+=d,m/=256,mLen-=8){}e=e<<mLen|m;eLen+=mLen;for(;0<eLen;buffer[offset+i]=255&e,i+=d,e/=256,eLen-=8){}buffer[offset+i-d]|=128*s}},{}],3:[function(require,module){var toString={}.toString;module.exports=Array.isArray||function(arr){return"[object Array]"==toString.call(arr)}},{}],buffer:[function(require,module,exports){(function(global){"use strict";var _StringfromCharCode=String.fromCharCode,_Mathmin=Math.min,base64=require("base64-js"),ieee754=require("ieee754"),isArray=require("isarray");exports.Buffer=Buffer;exports.SlowBuffer=function(length){if(+length!=length){length=0}return Buffer.alloc(+length)};exports.INSPECT_MAX_BYTES=50;Buffer.TYPED_ARRAY_SUPPORT=void 0!==global.TYPED_ARRAY_SUPPORT?global.TYPED_ARRAY_SUPPORT:function(){try{var arr=new Uint8Array(1);arr.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}};return 42===arr.foo()&&"function"===typeof arr.subarray&&0===arr.subarray(1,1).byteLength}catch(e){return!1}}();exports.kMaxLength=kMaxLength();function kMaxLength(){return Buffer.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function createBuffer(that,length){if(kMaxLength()<length){throw new RangeError("Invalid typed array length")}if(Buffer.TYPED_ARRAY_SUPPORT){that=new Uint8Array(length);that.__proto__=Buffer.prototype}else{if(null===that){that=new Buffer(length)}that.length=length}return that}function Buffer(arg,encodingOrOffset,length){if(!Buffer.TYPED_ARRAY_SUPPORT&&!(this instanceof Buffer)){return new Buffer(arg,encodingOrOffset,length)}if("number"===typeof arg){if("string"===typeof encodingOrOffset){throw new Error("If encoding is specified then the first argument must be a string")}return allocUnsafe(this,arg)}return from(this,arg,encodingOrOffset,length)}Buffer.poolSize=8192;Buffer._augment=function(arr){arr.__proto__=Buffer.prototype;return arr};function from(that,value,encodingOrOffset,length){if("number"===typeof value){throw new TypeError("\"value\" argument must not be a number")}if("undefined"!==typeof ArrayBuffer&&value instanceof ArrayBuffer){return fromArrayBuffer(that,value,encodingOrOffset,length)}if("string"===typeof value){return fromString(that,value,encodingOrOffset)}return fromObject(that,value)}Buffer.from=function(value,encodingOrOffset,length){return from(null,value,encodingOrOffset,length)};if(Buffer.TYPED_ARRAY_SUPPORT){Buffer.prototype.__proto__=Uint8Array.prototype;Buffer.__proto__=Uint8Array;if("undefined"!==typeof Symbol&&Symbol.species&&Buffer[Symbol.species]===Buffer){Object.defineProperty(Buffer,Symbol.species,{value:null,configurable:!0})}}function assertSize(size){if("number"!==typeof size){throw new TypeError("\"size\" argument must be a number")}else if(0>size){throw new RangeError("\"size\" argument must not be negative")}}function alloc(that,size,fill,encoding){assertSize(size);if(0>=size){return createBuffer(that,size)}if(void 0!==fill){return"string"===typeof encoding?createBuffer(that,size).fill(fill,encoding):createBuffer(that,size).fill(fill)}return createBuffer(that,size)}Buffer.alloc=function(size,fill,encoding){return alloc(null,size,fill,encoding)};function allocUnsafe(that,size){assertSize(size);that=createBuffer(that,0>size?0:0|checked(size));if(!Buffer.TYPED_ARRAY_SUPPORT){for(var i=0;i<size;++i){that[i]=0}}return that}Buffer.allocUnsafe=function(size){return allocUnsafe(null,size)};Buffer.allocUnsafeSlow=function(size){return allocUnsafe(null,size)};function fromString(that,string,encoding){if("string"!==typeof encoding||""===encoding){encoding="utf8"}if(!Buffer.isEncoding(encoding)){throw new TypeError("\"encoding\" must be a valid string encoding")}var length=0|byteLength(string,encoding);that=createBuffer(that,length);var actual=that.write(string,encoding);if(actual!==length){that=that.slice(0,actual)}return that}function fromArrayLike(that,array){var length=0>array.length?0:0|checked(array.length);that=createBuffer(that,length);for(var i=0;i<length;i+=1){that[i]=255&array[i]}return that}function fromArrayBuffer(that,array,byteOffset,length){array.byteLength;if(0>byteOffset||array.byteLength<byteOffset){throw new RangeError("'offset' is out of bounds")}if(array.byteLength<byteOffset+(length||0)){throw new RangeError("'length' is out of bounds")}if(void 0===byteOffset&&void 0===length){array=new Uint8Array(array)}else if(void 0===length){array=new Uint8Array(array,byteOffset)}else{array=new Uint8Array(array,byteOffset,length)}if(Buffer.TYPED_ARRAY_SUPPORT){that=array;that.__proto__=Buffer.prototype}else{that=fromArrayLike(that,array)}return that}function fromObject(that,obj){if(Buffer.isBuffer(obj)){var len=0|checked(obj.length);that=createBuffer(that,len);if(0===that.length){return that}obj.copy(that,0,0,len);return that}if(obj){if("undefined"!==typeof ArrayBuffer&&obj.buffer instanceof ArrayBuffer||"length"in obj){if("number"!==typeof obj.length||isnan(obj.length)){return createBuffer(that,0)}return fromArrayLike(that,obj)}if("Buffer"===obj.type&&isArray(obj.data)){return fromArrayLike(that,obj.data)}}throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}function checked(length){if(length>=kMaxLength()){throw new RangeError("Attempt to allocate Buffer larger than maximum "+"size: 0x"+kMaxLength().toString(16)+" bytes")}return 0|length}Buffer.isBuffer=function(b){return!!(null!=b&&b._isBuffer)};Buffer.compare=function(a,b){if(!Buffer.isBuffer(a)||!Buffer.isBuffer(b)){throw new TypeError("Arguments must be Buffers")}if(a===b)return 0;for(var x=a.length,y=b.length,i=0,len=_Mathmin(x,y);i<len;++i){if(a[i]!==b[i]){x=a[i];y=b[i];break}}if(x<y)return-1;if(y<x)return 1;return 0};Buffer.isEncoding=function(encoding){switch((encoding+"").toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1;}};Buffer.concat=function(list,length){if(!isArray(list)){throw new TypeError("\"list\" argument must be an Array of Buffers")}if(0===list.length){return Buffer.alloc(0)}var i;if(void 0===length){length=0;for(i=0;i<list.length;++i){length+=list[i].length}}var buffer=Buffer.allocUnsafe(length),pos=0;for(i=0;i<list.length;++i){var buf=list[i];if(!Buffer.isBuffer(buf)){throw new TypeError("\"list\" argument must be an Array of Buffers")}buf.copy(buffer,pos);pos+=buf.length}return buffer};function byteLength(string,encoding){if(Buffer.isBuffer(string)){return string.length}if("undefined"!==typeof ArrayBuffer&&"function"===typeof ArrayBuffer.isView&&(ArrayBuffer.isView(string)||string instanceof ArrayBuffer)){return string.byteLength}if("string"!==typeof string){string=""+string}var len=string.length;if(0===len)return 0;var loweredCase=!1;for(;;){switch(encoding){case"ascii":case"latin1":case"binary":return len;case"utf8":case"utf-8":case void 0:return utf8ToBytes(string).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*len;case"hex":return len>>>1;case"base64":return base64ToBytes(string).length;default:if(loweredCase)return utf8ToBytes(string).length;encoding=(""+encoding).toLowerCase();loweredCase=!0;}}}Buffer.byteLength=byteLength;function slowToString(encoding,start,end){var loweredCase=!1;if(void 0===start||0>start){start=0}if(start>this.length){return""}if(void 0===end||end>this.length){end=this.length}if(0>=end){return""}end>>>=0;start>>>=0;if(end<=start){return""}if(!encoding)encoding="utf8";while(!0){switch(encoding){case"hex":return hexSlice(this,start,end);case"utf8":case"utf-8":return utf8Slice(this,start,end);case"ascii":return asciiSlice(this,start,end);case"latin1":case"binary":return latin1Slice(this,start,end);case"base64":return base64Slice(this,start,end);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return utf16leSlice(this,start,end);default:if(loweredCase)throw new TypeError("Unknown encoding: "+encoding);encoding=(encoding+"").toLowerCase();loweredCase=!0;}}}Buffer.prototype._isBuffer=!0;function swap(b,n,m){var i=b[n];b[n]=b[m];b[m]=i}Buffer.prototype.swap16=function(){var len=this.length;if(0!==len%2){throw new RangeError("Buffer size must be a multiple of 16-bits")}for(var i=0;i<len;i+=2){swap(this,i,i+1)}return this};Buffer.prototype.swap32=function(){var len=this.length;if(0!==len%4){throw new RangeError("Buffer size must be a multiple of 32-bits")}for(var i=0;i<len;i+=4){swap(this,i,i+3);swap(this,i+1,i+2)}return this};Buffer.prototype.swap64=function(){var len=this.length;if(0!==len%8){throw new RangeError("Buffer size must be a multiple of 64-bits")}for(var i=0;i<len;i+=8){swap(this,i,i+7);swap(this,i+1,i+6);swap(this,i+2,i+5);swap(this,i+3,i+4)}return this};Buffer.prototype.toString=function(){var length=0|this.length;if(0===length)return"";if(0===arguments.length)return utf8Slice(this,0,length);return slowToString.apply(this,arguments)};Buffer.prototype.equals=function(b){if(!Buffer.isBuffer(b))throw new TypeError("Argument must be a Buffer");if(this===b)return!0;return 0===Buffer.compare(this,b)};Buffer.prototype.inspect=function(){var str="",max=exports.INSPECT_MAX_BYTES;if(0<this.length){str=this.toString("hex",0,max).match(/.{2}/g).join(" ");if(this.length>max)str+=" ... "}return"<Buffer "+str+">"};Buffer.prototype.compare=function(target,start,end,thisStart,thisEnd){if(!Buffer.isBuffer(target)){throw new TypeError("Argument must be a Buffer")}if(void 0===start){start=0}if(void 0===end){end=target?target.length:0}if(void 0===thisStart){thisStart=0}if(void 0===thisEnd){thisEnd=this.length}if(0>start||end>target.length||0>thisStart||thisEnd>this.length){throw new RangeError("out of range index")}if(thisStart>=thisEnd&&start>=end){return 0}if(thisStart>=thisEnd){return-1}if(start>=end){return 1}start>>>=0;end>>>=0;thisStart>>>=0;thisEnd>>>=0;if(this===target)return 0;for(var x=thisEnd-thisStart,y=end-start,len=_Mathmin(x,y),thisCopy=this.slice(thisStart,thisEnd),targetCopy=target.slice(start,end),i=0;i<len;++i){if(thisCopy[i]!==targetCopy[i]){x=thisCopy[i];y=targetCopy[i];break}}if(x<y)return-1;if(y<x)return 1;return 0};function bidirectionalIndexOf(buffer,val,byteOffset,encoding,dir){if(0===buffer.length)return-1;if("string"===typeof byteOffset){encoding=byteOffset;byteOffset=0}else if(2147483647<byteOffset){byteOffset=2147483647}else if(-2147483648>byteOffset){byteOffset=-2147483648}byteOffset=+byteOffset;if(isNaN(byteOffset)){byteOffset=dir?0:buffer.length-1}if(0>byteOffset)byteOffset=buffer.length+byteOffset;if(byteOffset>=buffer.length){if(dir)return-1;else byteOffset=buffer.length-1}else if(0>byteOffset){if(dir)byteOffset=0;else return-1}if("string"===typeof val){val=Buffer.from(val,encoding)}if(Buffer.isBuffer(val)){if(0===val.length){return-1}return arrayIndexOf(buffer,val,byteOffset,encoding,dir)}else if("number"===typeof val){val=255&val;if(Buffer.TYPED_ARRAY_SUPPORT&&"function"===typeof Uint8Array.prototype.indexOf){if(dir){return Uint8Array.prototype.indexOf.call(buffer,val,byteOffset)}else{return Uint8Array.prototype.lastIndexOf.call(buffer,val,byteOffset)}}return arrayIndexOf(buffer,[val],byteOffset,encoding,dir)}throw new TypeError("val must be string, number or Buffer")}function arrayIndexOf(arr,val,byteOffset,encoding,dir){var indexSize=1,arrLength=arr.length,valLength=val.length;if(void 0!==encoding){encoding=(encoding+"").toLowerCase();if("ucs2"===encoding||"ucs-2"===encoding||"utf16le"===encoding||"utf-16le"===encoding){if(2>arr.length||2>val.length){return-1}indexSize=2;arrLength/=2;valLength/=2;byteOffset/=2}}function read(buf,i){if(1===indexSize){return buf[i]}else{return buf.readUInt16BE(i*indexSize)}}var i;if(dir){var foundIndex=-1;for(i=byteOffset;i<arrLength;i++){if(read(arr,i)===read(val,-1===foundIndex?0:i-foundIndex)){if(-1===foundIndex)foundIndex=i;if(i-foundIndex+1===valLength)return foundIndex*indexSize}else{if(-1!==foundIndex)i-=i-foundIndex;foundIndex=-1}}}else{if(byteOffset+valLength>arrLength)byteOffset=arrLength-valLength;for(i=byteOffset;0<=i;i--){for(var found=!0,j=0;j<valLength;j++){if(read(arr,i+j)!==read(val,j)){found=!1;break}}if(found)return i}}return-1}Buffer.prototype.includes=function(val,byteOffset,encoding){return-1!==this.indexOf(val,byteOffset,encoding)};Buffer.prototype.indexOf=function(val,byteOffset,encoding){return bidirectionalIndexOf(this,val,byteOffset,encoding,!0)};Buffer.prototype.lastIndexOf=function(val,byteOffset,encoding){return bidirectionalIndexOf(this,val,byteOffset,encoding,!1)};function hexWrite(buf,string,offset,length){offset=+offset||0;var remaining=buf.length-offset;if(!length){length=remaining}else{length=+length;if(length>remaining){length=remaining}}var strLen=string.length;if(0!==strLen%2)throw new TypeError("Invalid hex string");if(length>strLen/2){length=strLen/2}for(var i=0,parsed;i<length;++i){parsed=parseInt(string.substr(2*i,2),16);if(isNaN(parsed))return i;buf[offset+i]=parsed}return i}function utf8Write(buf,string,offset,length){return blitBuffer(utf8ToBytes(string,buf.length-offset),buf,offset,length)}function asciiWrite(buf,string,offset,length){return blitBuffer(asciiToBytes(string),buf,offset,length)}function latin1Write(buf,string,offset,length){return asciiWrite(buf,string,offset,length)}function base64Write(buf,string,offset,length){return blitBuffer(base64ToBytes(string),buf,offset,length)}function ucs2Write(buf,string,offset,length){return blitBuffer(utf16leToBytes(string,buf.length-offset),buf,offset,length)}Buffer.prototype.write=function(string,offset,length,encoding){if(void 0===offset){encoding="utf8";length=this.length;offset=0}else if(void 0===length&&"string"===typeof offset){encoding=offset;length=this.length;offset=0}else if(isFinite(offset)){offset=0|offset;if(isFinite(length)){length=0|length;if(void 0===encoding)encoding="utf8"}else{encoding=length;length=void 0}}else{throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported")}var remaining=this.length-offset;if(void 0===length||length>remaining)length=remaining;if(0<string.length&&(0>length||0>offset)||offset>this.length){throw new RangeError("Attempt to write outside buffer bounds")}if(!encoding)encoding="utf8";var loweredCase=!1;for(;;){switch(encoding){case"hex":return hexWrite(this,string,offset,length);case"utf8":case"utf-8":return utf8Write(this,string,offset,length);case"ascii":return asciiWrite(this,string,offset,length);case"latin1":case"binary":return latin1Write(this,string,offset,length);case"base64":return base64Write(this,string,offset,length);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return ucs2Write(this,string,offset,length);default:if(loweredCase)throw new TypeError("Unknown encoding: "+encoding);encoding=(""+encoding).toLowerCase();loweredCase=!0;}}};Buffer.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};function base64Slice(buf,start,end){if(0===start&&end===buf.length){return base64.fromByteArray(buf)}else{return base64.fromByteArray(buf.slice(start,end))}}function utf8Slice(buf,start,end){end=_Mathmin(buf.length,end);var res=[],i=start;while(i<end){var firstByte=buf[i],codePoint=null,bytesPerSequence=239<firstByte?4:223<firstByte?3:191<firstByte?2:1;if(i+bytesPerSequence<=end){var secondByte,thirdByte,fourthByte,tempCodePoint;switch(bytesPerSequence){case 1:if(128>firstByte){codePoint=firstByte}break;case 2:secondByte=buf[i+1];if(128===(192&secondByte)){tempCodePoint=(31&firstByte)<<6|63&secondByte;if(127<tempCodePoint){codePoint=tempCodePoint}}break;case 3:secondByte=buf[i+1];thirdByte=buf[i+2];if(128===(192&secondByte)&&128===(192&thirdByte)){tempCodePoint=(15&firstByte)<<12|(63&secondByte)<<6|63&thirdByte;if(2047<tempCodePoint&&(55296>tempCodePoint||57343<tempCodePoint)){codePoint=tempCodePoint}}break;case 4:secondByte=buf[i+1];thirdByte=buf[i+2];fourthByte=buf[i+3];if(128===(192&secondByte)&&128===(192&thirdByte)&&128===(192&fourthByte)){tempCodePoint=(15&firstByte)<<18|(63&secondByte)<<12|(63&thirdByte)<<6|63&fourthByte;if(65535<tempCodePoint&&1114112>tempCodePoint){codePoint=tempCodePoint}}}}if(null===codePoint){codePoint=65533;bytesPerSequence=1}else if(65535<codePoint){codePoint-=65536;res.push(55296|1023&codePoint>>>10);codePoint=56320|1023&codePoint}res.push(codePoint);i+=bytesPerSequence}return decodeCodePointsArray(res)}var MAX_ARGUMENTS_LENGTH=4096;function decodeCodePointsArray(codePoints){var len=codePoints.length;if(len<=MAX_ARGUMENTS_LENGTH){return _StringfromCharCode.apply(String,codePoints)}var res="",i=0;while(i<len){res+=_StringfromCharCode.apply(String,codePoints.slice(i,i+=MAX_ARGUMENTS_LENGTH))}return res}function asciiSlice(buf,start,end){var ret="";end=_Mathmin(buf.length,end);for(var i=start;i<end;++i){ret+=_StringfromCharCode(127&buf[i])}return ret}function latin1Slice(buf,start,end){var ret="";end=_Mathmin(buf.length,end);for(var i=start;i<end;++i){ret+=_StringfromCharCode(buf[i])}return ret}function hexSlice(buf,start,end){var len=buf.length;if(!start||0>start)start=0;if(!end||0>end||end>len)end=len;for(var out="",i=start;i<end;++i){out+=toHex(buf[i])}return out}function utf16leSlice(buf,start,end){for(var bytes=buf.slice(start,end),res="",i=0;i<bytes.length;i+=2){res+=_StringfromCharCode(bytes[i]+256*bytes[i+1])}return res}Buffer.prototype.slice=function(start,end){var len=this.length;start=~~start;end=void 0===end?len:~~end;if(0>start){start+=len;if(0>start)start=0}else if(start>len){start=len}if(0>end){end+=len;if(0>end)end=0}else if(end>len){end=len}if(end<start)end=start;var newBuf;if(Buffer.TYPED_ARRAY_SUPPORT){newBuf=this.subarray(start,end);newBuf.__proto__=Buffer.prototype}else{var sliceLen=end-start;newBuf=new Buffer(sliceLen,void 0);for(var i=0;i<sliceLen;++i){newBuf[i]=this[i+start]}}return newBuf};function checkOffset(offset,ext,length){if(0!==offset%1||0>offset)throw new RangeError("offset is not uint");if(offset+ext>length)throw new RangeError("Trying to access beyond buffer length")}Buffer.prototype.readUIntLE=function(offset,byteLength,noAssert){offset=0|offset;byteLength=0|byteLength;if(!noAssert)checkOffset(offset,byteLength,this.length);var val=this[offset],mul=1,i=0;while(++i<byteLength&&(mul*=256)){val+=this[offset+i]*mul}return val};Buffer.prototype.readUIntBE=function(offset,byteLength,noAssert){offset=0|offset;byteLength=0|byteLength;if(!noAssert){checkOffset(offset,byteLength,this.length)}var val=this[offset+--byteLength],mul=1;while(0<byteLength&&(mul*=256)){val+=this[offset+--byteLength]*mul}return val};Buffer.prototype.readUInt8=function(offset,noAssert){if(!noAssert)checkOffset(offset,1,this.length);return this[offset]};Buffer.prototype.readUInt16LE=function(offset,noAssert){if(!noAssert)checkOffset(offset,2,this.length);return this[offset]|this[offset+1]<<8};Buffer.prototype.readUInt16BE=function(offset,noAssert){if(!noAssert)checkOffset(offset,2,this.length);return this[offset]<<8|this[offset+1]};Buffer.prototype.readUInt32LE=function(offset,noAssert){if(!noAssert)checkOffset(offset,4,this.length);return(this[offset]|this[offset+1]<<8|this[offset+2]<<16)+16777216*this[offset+3]};Buffer.prototype.readUInt32BE=function(offset,noAssert){if(!noAssert)checkOffset(offset,4,this.length);return 16777216*this[offset]+(this[offset+1]<<16|this[offset+2]<<8|this[offset+3])};Buffer.prototype.readIntLE=function(offset,byteLength,noAssert){offset=0|offset;byteLength=0|byteLength;if(!noAssert)checkOffset(offset,byteLength,this.length);var val=this[offset],mul=1,i=0;while(++i<byteLength&&(mul*=256)){val+=this[offset+i]*mul}mul*=128;if(val>=mul)val-=_Mathpow(2,8*byteLength);return val};Buffer.prototype.readIntBE=function(offset,byteLength,noAssert){offset=0|offset;byteLength=0|byteLength;if(!noAssert)checkOffset(offset,byteLength,this.length);var i=byteLength,mul=1,val=this[offset+--i];while(0<i&&(mul*=256)){val+=this[offset+--i]*mul}mul*=128;if(val>=mul)val-=_Mathpow(2,8*byteLength);return val};Buffer.prototype.readInt8=function(offset,noAssert){if(!noAssert)checkOffset(offset,1,this.length);if(!(128&this[offset]))return this[offset];return-1*(255-this[offset]+1)};Buffer.prototype.readInt16LE=function(offset,noAssert){if(!noAssert)checkOffset(offset,2,this.length);var val=this[offset]|this[offset+1]<<8;return 32768&val?4294901760|val:val};Buffer.prototype.readInt16BE=function(offset,noAssert){if(!noAssert)checkOffset(offset,2,this.length);var val=this[offset+1]|this[offset]<<8;return 32768&val?4294901760|val:val};Buffer.prototype.readInt32LE=function(offset,noAssert){if(!noAssert)checkOffset(offset,4,this.length);return this[offset]|this[offset+1]<<8|this[offset+2]<<16|this[offset+3]<<24};Buffer.prototype.readInt32BE=function(offset,noAssert){if(!noAssert)checkOffset(offset,4,this.length);return this[offset]<<24|this[offset+1]<<16|this[offset+2]<<8|this[offset+3]};Buffer.prototype.readFloatLE=function(offset,noAssert){if(!noAssert)checkOffset(offset,4,this.length);return ieee754.read(this,offset,!0,23,4)};Buffer.prototype.readFloatBE=function(offset,noAssert){if(!noAssert)checkOffset(offset,4,this.length);return ieee754.read(this,offset,!1,23,4)};Buffer.prototype.readDoubleLE=function(offset,noAssert){if(!noAssert)checkOffset(offset,8,this.length);return ieee754.read(this,offset,!0,52,8)};Buffer.prototype.readDoubleBE=function(offset,noAssert){if(!noAssert)checkOffset(offset,8,this.length);return ieee754.read(this,offset,!1,52,8)};function checkInt(buf,value,offset,ext,max,min){if(!Buffer.isBuffer(buf))throw new TypeError("\"buffer\" argument must be a Buffer instance");if(value>max||value<min)throw new RangeError("\"value\" argument is out of bounds");if(offset+ext>buf.length)throw new RangeError("Index out of range")}Buffer.prototype.writeUIntLE=function(value,offset,byteLength,noAssert){value=+value;offset=0|offset;byteLength=0|byteLength;if(!noAssert){var maxBytes=_Mathpow(2,8*byteLength)-1;checkInt(this,value,offset,byteLength,maxBytes,0)}var mul=1,i=0;this[offset]=255&value;while(++i<byteLength&&(mul*=256)){this[offset+i]=255&value/mul}return offset+byteLength};Buffer.prototype.writeUIntBE=function(value,offset,byteLength,noAssert){value=+value;offset=0|offset;byteLength=0|byteLength;if(!noAssert){var maxBytes=_Mathpow(2,8*byteLength)-1;checkInt(this,value,offset,byteLength,maxBytes,0)}var i=byteLength-1,mul=1;this[offset+i]=255&value;while(0<=--i&&(mul*=256)){this[offset+i]=255&value/mul}return offset+byteLength};Buffer.prototype.writeUInt8=function(value,offset,noAssert){value=+value;offset=0|offset;if(!noAssert)checkInt(this,value,offset,1,255,0);if(!Buffer.TYPED_ARRAY_SUPPORT)value=_Mathfloor(value);this[offset]=255&value;return offset+1};function objectWriteUInt16(buf,value,offset,littleEndian){if(0>value)value=65535+value+1;for(var i=0,j=_Mathmin(buf.length-offset,2);i<j;++i){buf[offset+i]=(value&255<<8*(littleEndian?i:1-i))>>>8*(littleEndian?i:1-i)}}Buffer.prototype.writeUInt16LE=function(value,offset,noAssert){value=+value;offset=0|offset;if(!noAssert)checkInt(this,value,offset,2,65535,0);if(Buffer.TYPED_ARRAY_SUPPORT){this[offset]=255&value;this[offset+1]=value>>>8}else{objectWriteUInt16(this,value,offset,!0)}return offset+2};Buffer.prototype.writeUInt16BE=function(value,offset,noAssert){value=+value;offset=0|offset;if(!noAssert)checkInt(this,value,offset,2,65535,0);if(Buffer.TYPED_ARRAY_SUPPORT){this[offset]=value>>>8;this[offset+1]=255&value}else{objectWriteUInt16(this,value,offset,!1)}return offset+2};function objectWriteUInt32(buf,value,offset,littleEndian){if(0>value)value=4294967295+value+1;for(var i=0,j=_Mathmin(buf.length-offset,4);i<j;++i){buf[offset+i]=255&value>>>8*(littleEndian?i:3-i)}}Buffer.prototype.writeUInt32LE=function(value,offset,noAssert){value=+value;offset=0|offset;if(!noAssert)checkInt(this,value,offset,4,4294967295,0);if(Buffer.TYPED_ARRAY_SUPPORT){this[offset+3]=value>>>24;this[offset+2]=value>>>16;this[offset+1]=value>>>8;this[offset]=255&value}else{objectWriteUInt32(this,value,offset,!0)}return offset+4};Buffer.prototype.writeUInt32BE=function(value,offset,noAssert){value=+value;offset=0|offset;if(!noAssert)checkInt(this,value,offset,4,4294967295,0);if(Buffer.TYPED_ARRAY_SUPPORT){this[offset]=value>>>24;this[offset+1]=value>>>16;this[offset+2]=value>>>8;this[offset+3]=255&value}else{objectWriteUInt32(this,value,offset,!1)}return offset+4};Buffer.prototype.writeIntLE=function(value,offset,byteLength,noAssert){value=+value;offset=0|offset;if(!noAssert){var limit=_Mathpow(2,8*byteLength-1);checkInt(this,value,offset,byteLength,limit-1,-limit)}var i=0,mul=1,sub=0;this[offset]=255&value;while(++i<byteLength&&(mul*=256)){if(0>value&&0===sub&&0!==this[offset+i-1]){sub=1}this[offset+i]=255&(value/mul>>0)-sub}return offset+byteLength};Buffer.prototype.writeIntBE=function(value,offset,byteLength,noAssert){value=+value;offset=0|offset;if(!noAssert){var limit=_Mathpow(2,8*byteLength-1);checkInt(this,value,offset,byteLength,limit-1,-limit)}var i=byteLength-1,mul=1,sub=0;this[offset+i]=255&value;while(0<=--i&&(mul*=256)){if(0>value&&0===sub&&0!==this[offset+i+1]){sub=1}this[offset+i]=255&(value/mul>>0)-sub}return offset+byteLength};Buffer.prototype.writeInt8=function(value,offset,noAssert){value=+value;offset=0|offset;if(!noAssert)checkInt(this,value,offset,1,127,-128);if(!Buffer.TYPED_ARRAY_SUPPORT)value=_Mathfloor(value);if(0>value)value=255+value+1;this[offset]=255&value;return offset+1};Buffer.prototype.writeInt16LE=function(value,offset,noAssert){value=+value;offset=0|offset;if(!noAssert)checkInt(this,value,offset,2,32767,-32768);if(Buffer.TYPED_ARRAY_SUPPORT){this[offset]=255&value;this[offset+1]=value>>>8}else{objectWriteUInt16(this,value,offset,!0)}return offset+2};Buffer.prototype.writeInt16BE=function(value,offset,noAssert){value=+value;offset=0|offset;if(!noAssert)checkInt(this,value,offset,2,32767,-32768);if(Buffer.TYPED_ARRAY_SUPPORT){this[offset]=value>>>8;this[offset+1]=255&value}else{objectWriteUInt16(this,value,offset,!1)}return offset+2};Buffer.prototype.writeInt32LE=function(value,offset,noAssert){value=+value;offset=0|offset;if(!noAssert)checkInt(this,value,offset,4,2147483647,-2147483648);if(Buffer.TYPED_ARRAY_SUPPORT){this[offset]=255&value;this[offset+1]=value>>>8;this[offset+2]=value>>>16;this[offset+3]=value>>>24}else{objectWriteUInt32(this,value,offset,!0)}return offset+4};Buffer.prototype.writeInt32BE=function(value,offset,noAssert){value=+value;offset=0|offset;if(!noAssert)checkInt(this,value,offset,4,2147483647,-2147483648);if(0>value)value=4294967295+value+1;if(Buffer.TYPED_ARRAY_SUPPORT){this[offset]=value>>>24;this[offset+1]=value>>>16;this[offset+2]=value>>>8;this[offset+3]=255&value}else{objectWriteUInt32(this,value,offset,!1)}return offset+4};function checkIEEE754(buf,value,offset,ext){if(offset+ext>buf.length)throw new RangeError("Index out of range");if(0>offset)throw new RangeError("Index out of range")}function writeFloat(buf,value,offset,littleEndian,noAssert){if(!noAssert){checkIEEE754(buf,value,offset,4,34028234663852886e22,-34028234663852886e22)}ieee754.write(buf,value,offset,littleEndian,23,4);return offset+4}Buffer.prototype.writeFloatLE=function(value,offset,noAssert){return writeFloat(this,value,offset,!0,noAssert)};Buffer.prototype.writeFloatBE=function(value,offset,noAssert){return writeFloat(this,value,offset,!1,noAssert)};function writeDouble(buf,value,offset,littleEndian,noAssert){if(!noAssert){checkIEEE754(buf,value,offset,8,17976931348623157e292,-17976931348623157e292)}ieee754.write(buf,value,offset,littleEndian,52,8);return offset+8}Buffer.prototype.writeDoubleLE=function(value,offset,noAssert){return writeDouble(this,value,offset,!0,noAssert)};Buffer.prototype.writeDoubleBE=function(value,offset,noAssert){return writeDouble(this,value,offset,!1,noAssert)};Buffer.prototype.copy=function(target,targetStart,start,end){if(!start)start=0;if(!end&&0!==end)end=this.length;if(targetStart>=target.length)targetStart=target.length;if(!targetStart)targetStart=0;if(0<end&&end<start)end=start;if(end===start)return 0;if(0===target.length||0===this.length)return 0;if(0>targetStart){throw new RangeError("targetStart out of bounds")}if(0>start||start>=this.length)throw new RangeError("sourceStart out of bounds");if(0>end)throw new RangeError("sourceEnd out of bounds");if(end>this.length)end=this.length;if(target.length-targetStart<end-start){end=target.length-targetStart+start}var len=end-start,i;if(this===target&&start<targetStart&&targetStart<end){for(i=len-1;0<=i;--i){target[i+targetStart]=this[i+start]}}else if(1e3>len||!Buffer.TYPED_ARRAY_SUPPORT){for(i=0;i<len;++i){target[i+targetStart]=this[i+start]}}else{Uint8Array.prototype.set.call(target,this.subarray(start,start+len),targetStart)}return len};Buffer.prototype.fill=function(val,start,end,encoding){if("string"===typeof val){if("string"===typeof start){encoding=start;start=0;end=this.length}else if("string"===typeof end){encoding=end;end=this.length}if(1===val.length){var code=val.charCodeAt(0);if(256>code){val=code}}if(void 0!==encoding&&"string"!==typeof encoding){throw new TypeError("encoding must be a string")}if("string"===typeof encoding&&!Buffer.isEncoding(encoding)){throw new TypeError("Unknown encoding: "+encoding)}}else if("number"===typeof val){val=255&val}if(0>start||this.length<start||this.length<end){throw new RangeError("Out of range index")}if(end<=start){return this}start=start>>>0;end=void 0===end?this.length:end>>>0;if(!val)val=0;var i;if("number"===typeof val){for(i=start;i<end;++i){this[i]=val}}else{var bytes=Buffer.isBuffer(val)?val:utf8ToBytes(new Buffer(val,encoding).toString()),len=bytes.length;for(i=0;i<end-start;++i){this[i+start]=bytes[i%len]}}return this};var INVALID_BASE64_RE=/[^+\/0-9A-Za-z-_]/g;function base64clean(str){str=stringtrim(str).replace(INVALID_BASE64_RE,"");if(2>str.length)return"";while(0!==str.length%4){str=str+"="}return str}function stringtrim(str){if(str.trim)return str.trim();return str.replace(/^\s+|\s+$/g,"")}function toHex(n){if(16>n)return"0"+n.toString(16);return n.toString(16)}function utf8ToBytes(string,units){units=units||1/0;for(var codePoint,length=string.length,leadSurrogate=null,bytes=[],i=0;i<length;++i){codePoint=string.charCodeAt(i);if(55295<codePoint&&57344>codePoint){if(!leadSurrogate){if(56319<codePoint){if(-1<(units-=3))bytes.push(239,191,189);continue}else if(i+1===length){if(-1<(units-=3))bytes.push(239,191,189);continue}leadSurrogate=codePoint;continue}if(56320>codePoint){if(-1<(units-=3))bytes.push(239,191,189);leadSurrogate=codePoint;continue}codePoint=(leadSurrogate-55296<<10|codePoint-56320)+65536}else if(leadSurrogate){if(-1<(units-=3))bytes.push(239,191,189)}leadSurrogate=null;if(128>codePoint){if(0>(units-=1))break;bytes.push(codePoint)}else if(2048>codePoint){if(0>(units-=2))break;bytes.push(192|codePoint>>6,128|63&codePoint)}else if(65536>codePoint){if(0>(units-=3))break;bytes.push(224|codePoint>>12,128|63&codePoint>>6,128|63&codePoint)}else if(1114112>codePoint){if(0>(units-=4))break;bytes.push(240|codePoint>>18,128|63&codePoint>>12,128|63&codePoint>>6,128|63&codePoint)}else{throw new Error("Invalid code point")}}return bytes}function asciiToBytes(str){for(var byteArray=[],i=0;i<str.length;++i){byteArray.push(255&str.charCodeAt(i))}return byteArray}function utf16leToBytes(str,units){for(var c,hi,lo,byteArray=[],i=0;i<str.length;++i){if(0>(units-=2))break;c=str.charCodeAt(i);hi=c>>8;lo=c%256;byteArray.push(lo);byteArray.push(hi)}return byteArray}function base64ToBytes(str){return base64.toByteArray(base64clean(str))}function blitBuffer(src,dst,offset,length){for(var i=0;i<length;++i){if(i+offset>=dst.length||i>=src.length)break;dst[i+offset]=src[i]}return i}function isnan(val){return val!==val}}).call(this,"undefined"!==typeof global?global:"undefined"!==typeof self?self:"undefined"!==typeof window?window:{})},{"base64-js":1,ieee754:2,isarray:3}]},{},[])("buffer")});