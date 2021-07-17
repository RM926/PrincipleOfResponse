
  /*
    Compiler
    功能：
      负责编译模板，解析指令和插值表达式
      负责页面的首次渲染
      当数据发生变化后重新渲染视图
    结构: el
          vm
          compile(el)
          compileElement(node)
          compileText(node)
          isDirective(attrName)
          isTextNode(node)
          isElementNode(node)
  */
  class Compiler{
    constructor(vm){
      this.el = vm.$el
      this.vm = vm
      this.compile(this.el)
    }
    //编译模板，处理文本节点和元素节点
    compile(el){
      //el.children获取到的是子元素
      //el.childNodes获取到的是子节点
      let childNodes = el.childNodes
      // console.log(childNodes)
      // Object.prototype.slice.call()
      Array.from(childNodes).forEach( node =>{
        //处理文本节点
        if(this.isTextNode(node)){
          this.compileText(node)
          //处理元素节点
        }else if(this.isElementNode(node)){
          this.compileElement(node)
        }

        //判断node节点，是否有子节点，要递归调用compile
        if(node.childNodes && node.childNodes.length){
          this.compile(node)
        }
      })
    }
    //编译元素节点，处理指令
    compileElement(node){
      console.log(node.attributes)
      //遍历属性所有的属性节点
      //一个节点有很多属性，遍历属性，判断是否为指令属性
      //attr 为一个属性对象，有name属性
      Array.from(node.attributes).forEach( attr => {
        //获取属性的名字
        let attrName = attr.name
        if(this.ifDirective(attrName)){
          //v-text --> text
          attrName = attrName.substr(2)
          let key = attr.value
          this.updata(node,key,attrName)
        }
      })
      //判断是否是指令
    }
    //node为节点，attrName为属性（v-text,v-model）的前缀，key为属性值
    updata(node,key,attrName){
      let updataFn = this[attrName + 'Updater']
      updataFn && updataFn.call(this,node,this.vm[key],key)
    }
    //处理v-text指令,node为DOM元素，value为v-text对应的数据
    textUpdater(node,value,key){
      node.textContent = value
      //this的指向问题
      new Watcher(this.vm,key,(newValue) => {
        node.textContent = newValue
      })
    }
    //处理v-model
    modelUpdater(node,value,key){
      node.value = value
      new Watcher(this.vm,key,(newValue) => {
        node.value = newValue
      })
      //双向绑定
      node.addEventListener('input',()=>{
        this.vm[key] = node.value
      })
    }
    //----------------------------------------------------
    //编译文本节点，处理插值表达式
    compileText(node){
      // console.dir(node)
      //{{ message  }} 匹配这种形式
      let reg = /\{\{(.+?)\}\}/
      let value = node.textContent
      if(reg.test(value)){
        let key = RegExp.$1.trim()
        node.textContent = value.replace(reg,this.vm[key])

        //创建Watcher对象，当数据改变更新视图
        new Watcher(this.vm,key,(newValue)=> {
          node.textContent = newValue
        })
      }
    }
    //判断元素属性是否为指令
    ifDirective(attrName){
      return attrName.startsWith('v-')
    }
    //判断节点是否为文本节点
    isTextNode(node){
      return node.nodeType === 3
    }
    //判断节点是否为元素节点
    isElementNode(node){
      return node.nodeType === 1
    }
  }
