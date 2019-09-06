import React from 'react'
import ReactDom from 'react-dom';
import Delete from '../dist';//'react-left-slide-delete';
class App extends React.Component {
    list = [0,1];
    render() {
        return (
            <div>
                {
                    this.list.map((v, i) => {
                        return (
                            <Delete key={v}
                                    onDelete={ev => {
                                        this.list.splice(i, 1);
                                        this.setState({});
                                    }}
                                    onEnd={state => {
                                        console.log(state);
                                    }}//滑动结束回调
                                    moveMin={15}//手指移动多少组件才开始动作
                                    multiple={4}//影响弹性算法的值
                                    autoDistance={20}//触发自动完成的值默认删除按钮的1/4
                                    >
                                <div style={
                                    {
                                        fontSize: 20,
                                        textAlign: 'center',
                                        lineHeight: '50px',
                                        height: 50,
                                        backgroundColor: v%2 ===0 ? 'green' : 'blue'
                                    }
                                }>{v}</div>
                            </Delete>
                        )
                    })
                }
            </div>
        )
    }
}
ReactDom.render(<App/>, root);
