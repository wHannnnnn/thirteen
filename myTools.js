//封装了一个$函数 
function $(selector,parent,tagName){

    var firstChar=selector.charAt(0);

    parent=parent||document;

    if(firstChar=="#"){
        return document.getElementById(selector.substring(1));
    }else if(firstChar=="."){
        //对tagName做一个判断，默认是* 全部标签
        tagName=tagName||"*";
        //从父级下获取特定的标签
        var allEles=parent.getElementsByTagName(tagName);

        var arr=[];//用于存储要找的所有的带该类的元素
        //循环所有的标签
        for(var i=0;i<allEles.length;i++){
            //将每一个标签的class通过空格 转成数组
            var arrClassNames=allEles[i].className.split(" ");
            //循环数组中的每一个class名，进行判断
            for(var j=0;j<arrClassNames.length;j++){
                //如果有一个class名和我要找的相等，说明该元素是我要找的元素
                if(arrClassNames[j]==selector.slice(1)){
                    //用数组存起来
                    arr.push(allEles[i]);
                    break;//停止向后查找
                }
            };
        };
        //当整个循环完毕， 返回数组（里面存着所有找到的元素）
        return arr;

    }else{
        return parent.getElementsByTagName(selector);
    }


}
//添加指定的类名
function addClass(obj,myClass){

    if(obj.classname==""){
        obj.className=myClass;
    }else{

        var arrClass=obj.className.split(" ");

        var _index=arrIndexOf(arrClass,myClass);
        if(_index==-1){
            obj.className+=" "+myClass;
        }
    }


}

//单独可以作为一个数组的查找方法
function arrIndexOf(arr,v){
    for(var i=0;i<arr.length;i++){
        if(arr[i]==v){
            return i;
        }

    };
    return -1;
}
//删除指定的类名
function removeClass(obj,myClass){
    if(obj.className!=""){

        var arrClass=obj.className.split(" ");

        var _index=arrIndexOf(arrClass,myClass);
        if(_index!=-1){
            arrClass.splice(_index,1);
        }
        obj.className=arrClass.join(" ");
    }


}
//封装了一个兼容获取样式表中的样式的函数
function getStyle(obj,attr){
    return obj.currentStyle ? obj.currentStyle[attr] :getComputedStyle(obj)[attr];
}
//获取一个元素距离浏览器的最终偏移量
function getPos(obj){
    var left=0;
    var top=0;
    while(obj){
        left+=obj.offsetLeft;
        top+=obj.offsetTop;
        obj=obj.offsetParent;
    }
    return {
        l:left,
        t:top
    }
}
//dom节点的兼容封装  （4个）
function first(obj){
    var firstElement=obj.firstElementChild||obj.firstChild;
    if(!firstElement||firstElement.nodeType!=1){
        return null;
    }else{
        return firstElement;
    }
}

function last(obj){
    var lastElement=obj.lastElementChild||obj.lastChild;
    if(!lastElement||lastElement.nodeType!=1){
        return null;
    }else{
        return lastElement;
    }
}

function next(obj){
    var next=obj.nextElementSibling||obj.nextSibling;
    if(!next||next.nodeType!=1){
        return null;
    }else{
        return next;
    }
}
function prev(obj){
    var prev=obj.previousElementSibling||obj.previousSibling;
    if(!prev||prev.nodeType!=1){
        return null;
    }else{
        return prev;
    }
}
//设置cookie
function setCookie(key,value,t){
    var mydate=new Date();
    // mydate.setDate(mydate.getDate()+t);
    mydate.setDate(mydate.getDate()+t);
    mydate.toGMTString();
    document.cookie=key+"="+ encodeURI(value)+";expires="+mydate.toGMTString();

}
//得到cookie
function getCookie(key){
    var arr=document.cookie.split("; ");
    for(var i=0;i<arr.length;i++){

        var newArr=arr[i].split("=");

        if(newArr[0]==key){
            return decodeURI(newArr[1]);
        }
    };

}
//  移除cookie函数	  
function removeCookie(key){
    setCookie(key,"",-1);
}
var Re={
    QQ:/^[1-9]\d{3,11}$/,
    Email:/^[\w][\w-]*@[a-z0-9A-Z]{2,6}(\.[a-z]{2,3}){1,3}$/,
    IDcard:/[1-9]\d{14}|[1-9]\d{17}|[1-9]\d{16}x/,
    post:/[1-9]\d{5}/,
    noSpace:/^\s*|\s*$/
};


function move ( obj, attr, rate, target, callback ) {
    clearInterval( obj.timer );
    obj.timer=null;
    var speed=parseFloat(getStyle( obj, attr ));
    rate = speed < target ? rate : -rate;
    obj.timer = setInterval(function () {
        speed += rate;			// 步长
        if ( speed >= target && rate > 0 ||  speed <= target && rate < 0  ) {
            speed = target;
        }
        obj.style[attr] = speed + 'px';
        if ( speed == target ) {
            clearInterval( obj.timer );
            obj.timer=null;
            callback && callback();
        }
    }, 30);
}


function startMove(obj, json,rate, fn) {
    clearInterval(obj.iTimer);
    obj.iTimer=null;
    var iCur = 0;
    var iSpeed = 0;
    obj.iTimer = setInterval(function() {
        var iBtn = true;
        for ( var attr in json ) {
            var iTarget = json[attr];
            if (attr == 'opacity') {
                iCur = Math.round(getStyle( obj, 'opacity' ) * 100);
            } else {
                iCur = parseInt(getStyle(obj, attr));
            }

            iSpeed = ( iTarget - iCur ) / rate;
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

            if (iCur != iTarget) {
                iBtn = false;
                if (attr == 'opacity') {
                    obj.style.opacity = (iCur + iSpeed) / 100;
                    obj.style.filter = 'alpha(opacity='+ (iCur + iSpeed) +')';
                } else {
                    obj.style[attr] = iCur + iSpeed + 'px';
                }
            }

        }

        if (iBtn) {
            clearInterval(obj.iTimer);
            obj.iTimer=null;
            fn && fn.call(obj);
        }

    }, 30);
}


function shake(obj,attr,fudu,rate,callback){
    if(obj.timers) return ;
    obj.timers=null;
    var Pos=parseInt( getStyle(obj,attr) );
    var num=0;
    //console.log(Pos);
    var arr=[];
    for(var i=fudu;i>0;i-=rate){
        arr.push(-i,i);
    };
    arr.push(0);
    //console.log(arr);

    obj.timers=setInterval(function(){

        obj.style[attr]=Pos+arr[num]+"px";
        num++;
        if(num>arr.length-1){
            clearInterval(obj.timers);
            obj.timers=null;
            callback&&callback();
        }

    },30);

}










