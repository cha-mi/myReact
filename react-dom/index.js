import Component from "./Component"
import { diff, diffNode } from "./diff"

const ReactDom = {
    render
}

function render(vnode, container, dom) {
    console.log(vnode, container, dom)
    return diff(dom, vnode, container)
    // return container.appendChild(_render(vnode))
}

export function createComponent(comp, props) {
    console.log(comp)
    let inst
    if (comp.prototype && comp.prototype.render) {
//    如果是类定义的组件 则创建实例返回
        inst = new comp(props)
    } else {
        //    如果是函数, 将函数组件扩展为类组件
        inst = new Component(props)
        inst.constructor = comp
        inst.render = function () {
            return this.constructor(props)
        }
    }
    return inst
}

export function renderComponent (comp) {
    let base
    const render = comp.render()
    // base = _render(render)
    if (comp.base && comp.componentWillUpdate) {
        comp.componentWillUpdate()
    }
    base = diffNode(comp.base, render)
    if (comp.base) {
        if (comp.componentDidUpdate) comp.componentDidUpdate()
    }else if (comp.componentDidMount) {
        comp.componentDidMount()
    }
//    节点替换
//     if (comp.base && comp.base.parentNode) {
//         comp.base.parentNode.replaceChild(base, comp.base)
//     }
    comp.base = base
}

export function setComponentProps(comp, props) {
    if (!comp.base) {
        if (comp.componentWillMount) comp.componentWillMount()
    } else if (comp.componentWillReceiveProps) {
        comp.componentWillReceiveProps()
    }
    comp.props = props
    renderComponent(comp)

}

function _render(vnode) {
    if (vnode === undefined || vnode === null || typeof vnode === 'boolean') return
    if (typeof vnode === 'number') {
        return document.createTextNode(vnode)
    }
    if (typeof vnode === 'string') {
        //    创建文本节点
        return document.createTextNode(vnode)
    }
//    如果tag是函数， 则渲染组件
    if (typeof vnode.tag === 'function') {
        //    1.创建组件
        const comp = createComponent(vnode.tag, vnode.attrs)
        //    2.设置组件属性
        setComponentProps(comp, vnode.attrs)
        //    3.组件渲染的节点对象
        return comp.base
    }
//    dom对象
    const {tag, attrs} = vnode
//    创建节点对象
    const dom = document.createElement(tag)
    if (attrs) {
        //    有属性
        Object.keys(attrs).forEach(key => {
            const val = attrs[key]
            setAttr(dom, key, val)
        })
    }
    // 渲染子节点
    vnode.childrens && vnode.childrens.forEach(child => render(child, dom))
    return dom
}

//设置属性
export function setAttr(dom, key, val) {
//    将属性名className 换成 class
    if (key === 'className') {
        key = 'class'
    }
//    如果是事件 onClick
    if (/on\w+/.test(key)) {
        //    转小写
        key = key.toLowerCase()
        dom[key] = val || ''
    } else if (key === 'style') {
        if (!val || typeof val === 'string') {
            dom.style.cssText = val || ''
        } else if (val && typeof val === 'object') {
            for (let k in val) {
                if (typeof val[k] === 'number') {
                    dom.style[k] = val[k] + px
                } else {
                    dom.style[k] = val[k]
                }
            }
        }
    } else {
        if (key in dom) {
            dom[key] = val || ''
        }
        if (val) {
            // 更新植
            dom.setAttribute(key, val)
        } else {
            dom.removeAttribute(key)
        }
    }
}

export default ReactDom
