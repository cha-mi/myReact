import { enqueueSetState } from '../react/set_state_quece'
class Component {
    constructor(props = {}) {
        this.props = props
        this.state = {}
    }
    setState(stateChange) {
        // // 对象拷贝
        // Object.assign(this.state, stateChange)
        // //  渲染组件
        // renderComponent(this)
        enqueueSetState(stateChange,this);
    }
}
export default Component
