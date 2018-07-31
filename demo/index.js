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
                                    width={70}
                                    autoDistance={20}>
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
