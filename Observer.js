

    // 功能：
    //   负责把data选项中的属性转换成响应式数据
    //   data中的某个属性也是对象，把该属性转换成响应式数据
    //   数据变化发送通知
    // 结构
    // class Observer{
    //   defineReactive(){}
    //   walk(){}
    // }
  class Observer{
    constructor(data){
      this.walk(data)
    }
    walk(data){
      //判断data是不是对象
      if(!data || typeof data !=='object'){
        return 
      }
      //遍历对象的所有属性
      Object.keys(data).forEach(key =>{
        this.defineReactive(data,key,data[key])
      })
    }
    //三个参数：对象，对象属性，对象属性的值
    defineReactive(obj,key,val){
      let that= this
      //负责收集数据，并发送通知
      let dep = new Dep()
      //如果val对象属性的值是对象，把val内部的属性转换成响应式数据
      this.walk(val)
      Object.defineProperty(obj,key,{
        enumerable:true,
        configurable:true,
        get(){
          //收集依赖
          Dep.target && dep.addSub(Dep.target)
          return val
        },
        set(newValue){
          if(newValue === val){
            return
          }
          val = newValue
          //  this.walk(newValue)//这样调用，this的指向是指向data中的某一项数据
          that.walk(newValue)
          //数据重新设置，需要发送通知改变视图数据
          //发送通知
          dep.notify()
        }
      })
    }
  }
