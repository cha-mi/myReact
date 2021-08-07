import React from "./react"
import ReactDom from "./react-dom"
const element = (
    <div className='title' style={{color: '#58bc58 '}}>
        hello <span>react</span>
    </div>
)
// const Home = function () {
//     return  <div className='title' style={{color: '#58bc58 '}}>
//         hello <span>react</span>
//     </div>
// }
class Home extends  React.Component {
    constructor(props) {
        super(props);
        this.state = {
            num : 1
        }
    }

    componentWillMount() {
        console.log('WillMount')
    }
    componentWillReceiveProps(props) {
        console.log('props')
    }
    componentWillUpdate() {
        console.log('update')
    }
    componentDidUpdate() {
        console.log('diupdate')
    }
    componentDidMount() {
        console.log('didmount')
        for (let i = 0; i<10 ; i++) {
            this.setState((prev) => {
                console.log(prev.num)
                return {
                    num: prev.num+1
                }
            })
        }
    }
    handlerClick() {
        console.log(666)
        this.setState({
            num: this.state.num + 1
        })
    }
    render() {
        return (
            <div className='title' style={{color: '#58bc58 '}}>
                hello <span>react</span>
                {this.state.num}
                <button onClick={this.handlerClick.bind(this)}>click</button>
            </div>
        );
    }
}
// ReactDom.render('React', document.querySelector('#root'))
ReactDom.render(<Home/>, document.querySelector('#root'))
