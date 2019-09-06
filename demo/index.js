import React from 'react'
import ReactDom from 'react-dom';
import Delete from '../dist';//'react-left-slide-delete';
const go = new Go();
let instance;
window.WebAssembly.instantiateStreaming(fetch("./assets/main.wasm"), go.importObject).then((result) => {
  instance = result.instance;
});
window.runWASM = function() {
  instance && go.run(instance);
};
window.runJS = function() {
  let c = 0;
  console.time('for');
  for (let i = 10000000000; i > 0; i--) {
    c++;
  }
  console.log(c);
  console.timeEnd('for');
};
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
