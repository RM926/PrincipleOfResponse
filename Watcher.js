/*
  Watch
  功能：
    当数据变化触发依赖，dep通知所有的Watcher实例更新视图
    自身实例化的时候往dep对象中添加自己
  
  结构：
    属性:vm
        key
        cb
        oldValue

    方法：updata
*/
class Watcher{
  constructor(vm,key,cb){
    this.vm = vm
    //data中的属性名称
    this.key = key
    //回调函数，负责更新视图
    this.cb = cb
    //把watcher对象记录到Dep类的静态属性target
    //这一步的目的是为了将Watcher加入到dep中
    //后面赋值为null，是为了避免重复加入相同的watcher
    Dep.target = this
    //触发get方法，在get方法中调用addSub,将自身Watcher加入到响应式系统当中
    this.oldValue = vm[key]
    Dep.target = null
  }
  //当数据发生变化的时候更新视图
  updata(){
    let newValue = this.vm[this.key]
    if(newValue === this.oldValue){
      return 
    }
    this.cb(newValue)
  }
}