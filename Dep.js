class Dep{
  constructor(){
    this.subs = []
  }
  //添加观察者
  addSub(sub){
    if( sub && sub.updata)
    this.subs.push(sub)
  }
  notify(){
    this.subs.forEach(sub => {
      sub.updata()
    })
  }
}