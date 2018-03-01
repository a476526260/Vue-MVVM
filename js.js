

/*数据初始化绑定*/

function nodeToFragment(node,vm){
	var flag=document.createDocumentFragment();
	var child;
	
	while(child=node.firstChild){
		compile(child,vm)
		flag.append(child);
	}
	return flag;
}

function compile(node,vm){
	var reg=/\{\{(.*)\}\}/;
	if(node.nodeType===1){
		var attr=node.attributes;
		for(var i=0;i<attr.length;i++){
			if(attr[i].nodeName=="v-model"){
				var name=attr[i].nodeValue;
				node.addEventListener("input",function(e){
					vm[name]=e.target.value
				});
				new Watcher(vm,node,name,"value");
				//node.value=vm[name];
				node.removeAttribute("v-model");
			}
		};		
	}
	
	if(node.nodeType===3){
		if(reg.test(node.nodeValue)){
			var name=RegExp.$1;
			name=name.trim();
			new Watcher(vm,node,name,"nodeValue");
			//node.nodeValue=vm[name];
		}		
	}
}

/*响应式的数据绑定*/
function defineReactive(obj,key,val){
	var dep=new Dep();
	Object.defineProperty(obj,key,{
		get:function(){
			if(Dep.target){
				dep.addSub(Dep.target)
			}
			console.log(dep)
			return val
		},
		set:function(newVal){
			if(newVal==val) return
			val =newVal;
			dep.notify();
		}
	})
}
function observe(obj,vm){
	Object.keys(obj).forEach(function(key){
		defineReactive(vm,key,obj[key])
	})
}
/*订阅者模式--实现双向数据绑定*/

/*订阅者*/

function Dep(){
	this.subs=[];
}
Dep.prototype={
	addSub:function(sub){
		this.subs.push(sub);   //添加订阅者
	},
	notify:function(){
		this.subs.forEach(function(sub){
			sub.update();     //下发通知
		});
	}
}

/*观察者*/

function Watcher(vm,node,name,type){
	Dep.target=this;
	this.node=node;
	this.name=name;
	this.vm=vm;
	this.type=type;
	this.update();
	Dep.target=null;
}
Watcher.prototype={
	update:function(){
		this.get();
		this.node[this.type]=this.value;
	},
	get:function(){
		this.value=this.vm[this.name];
	}	
}


function Vue(options){
	this.data=options.data;
	var data=this.data;
	observe(data,this);
		
	var id=options.el;
	var dom=nodeToFragment(document.getElementById(id),this);	
	document.getElementById(id).appendChild(dom);
}



var vm=new Vue({
	el:"app",
	data:{
		text:"hello world"
	}
})



