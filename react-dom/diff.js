import {setAttr, setComponentProps, createComponent} from "./index"

export function diff(dom, vnode, container) {
    const ret = diffNode(dom, vnode)
    if (container) {
        console.log(ret)
        container.appendChild(ret)
    }
    return ret
}
export function diffNode(dom, vnode) {
    let out = dom
    if (vnode === undefined || vnode === null || typeof vnode === 'boolean') return
    if (typeof vnode === 'number') {
        return document.createTextNode(vnode)
    }
    if (typeof vnode === 'string') {
        //    创建文本节点
        if (dom && dom.nodeType == 3) {
            if (dom.textContent !== vnode) {
                dom.textContent = vnode
            }
        } else {
            out = document.createTextNode(vnode)
            if (dom && dom.parentNode) {
                dom.parentNode.replaceChild(out, dom)
            }
        }
        return out
    }
    if (typeof vnode.tag === 'function') {
        return diffCompoent(out, vnode)
    }
    //    非文本dom节点
    if (!dom) {
        console.log(vnode)
        out = document.createElement(vnode.tag)
    }
    if (vnode.childrens && vnode.childrens.length || (out.childNodes && out.childNodes.length)){
    //    对比组件或子节点
        diffChildren(out, vnode.childrens)
    }
    diffAttr(out, vnode)
    return out
}
function diffCompoent(dom, vnode) {
    let comp = dom
    // 组件没有变化
    if (comp && comp.constructor === vnode.tag) {
        setComponentProps(comp, vnode.attrs)
        dom = comp.base
    }else {
        // 组件发生变化
        if(comp) {
            // 先移除旧组件
            unmountComonent(comp)
            comp = null
        }
        // 创建新组件
        comp = createComponent(vnode.tag, vnode.attrs)
        // 设置组件属性
        setComponentProps(comp, vnode.attrs)
        // 挂载
        dom = comp.base
    }
    return dom
}
function unmountComonent(comp) {
    removeNode(comp.base)
}
function removeNode(dom) {
    if (dom && dom.parentNode) {
        dom.parentNode.removeChild(dom)
    }
}
function diffChildren(dom ,vchildren) {
    const domChildren = dom.childNodes
    const children = []
    const keyed = {}
    if (domChildren.length > 0) {
        [...domChildren].forEach(item => {
            // 获取key
            const key = item.key;
            if (key) {
                // 如果key存在,保存到对象中
                keyed[key] = item;
            } else {
                // 如果key不存在,保存到数组中
                children.push(item)
            }

        })
    }
    if (vchildren && vchildren.length > 0) {
        let min = 0;
        let childrenLen = children.length;
        [...vchildren].forEach((vchild, i) => {
            const key = vchild.key
            let child
            if (key) {
                if (keyed[key]) {
                    child = keyed[key]
                    keyed[key] = undefined
                }
            }else if (childrenLen > min) {
                // 如果没有key 优先找相同类型的节点
                for (let j = min; j<childrenLen; j++) {
                    let c = children[j]
                    if (c) {
                        child = c
                        children[j] = undefined
                        if (j === childrenLen - 1) childrenLen--
                        if (j === min) min++
                        break
                    }
                }
            }
            child = diffNode(child, vchild)
            const f = domChildren[i]
            if (child && child !== dom && child !==f ) {
                if (!f) {
                    dom.appendChild(child)
                }  else  if (child === f.nextSibling) {
                    removeNode(f)
                } else {
                    dom.insertBefore(child, f)
                }
            }
        })
    }
}
function  diffAttr (dom, vnode) {
//     dom是原有节点 vnode 虚拟dom
    const oldAttrs = {}
    const newAttrs = vnode.attrs
    const domAttrs = dom.attributes;
    [...domAttrs].forEach(item => {
        // console.log(item)
        oldAttrs[item.name] = item.value
    })

//    比较 原来属性跟新的属性对比，不在新的属性中，则将其移除掉
    for (let key in oldAttrs) {
        if (!(key in newAttrs)) {
            setAttr(dom, key, undefined)
        }
    }
//    更新
    for (let key in newAttrs) {
        if (oldAttrs[key] !== newAttrs[key]) {
            setAttr(dom, key, newAttrs[key])
        }
    }


}
