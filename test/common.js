function cmd(cm) {
    var f = document.forms['f'];
    f.cm.value = cm;
//  if(typeof(t) != 'undefined') f.target = t;
//  f.submit();
//  f.target = null;
//  return false;
}

function link(cm, t) {
    var f = document.forms['f'];
    f.cm.value = cm;
    if(typeof(t) != 'undefined') f.target = t;
    f.submit();
    if(typeof(t) != 'undefined') f.target = '';
//  f.target = null;
}

function sub() {
//  return true;
}

window.onload = function (){
    var list = document.getElementsByTagName("input");
    for(var i=0; i<list.length; i++){
        if(list[i].type == 'text' || list[i].type == 'password') {
            list[i].onkeypress = function (event){
                return submitStop(event);
            };
        }
    }
}

function submitStop(e){
    if (!e) var e = window.event;

    if(e.keyCode == 13)
        return false;
}