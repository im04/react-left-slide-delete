import React, {Component} from 'react'
import style from './index.css';
import PropTypes from 'prop-types'
export default class DeleteBySlide extends Component {
    static propTypes = {
        onDelete: PropTypes.func, // 删除回调
        autoDistance: PropTypes.number // 自动完成滑动宽度 px
    };
    componentDidMount() {
        this.refs.main.addEventListener('touchstart', this.onStart, {
          passive: false
        });
    }
    onDelete = (ev) => {
        const {
            onDelete
        } = this.props;
        typeof onDelete === 'function' && onDelete(ev);
    };
    onStart = ev => {
       let self = this;
        const {
            autoDistance,
            onEnd,
            moveMinNum,
            multipleNum
        } = this.props;
        let btnEl = this.refs.btn;
        let childrenEl = btnEl.children && btnEl.children.length && btnEl.children[0];
        let moveMax = childrenEl ? childrenEl.clientWidth : 120;
        let moveAuto = autoDistance || moveMax / 4;
        let moveMin = moveMinNum || 10;
        let multiple = multipleNum || 3;
        let {currentTarget} = ev;
        let type = currentTarget.classList.contains('active');
        let flag = type;
        let startX = ev.touches[0].clientX;
        let isLeft = false;
        let isRight = false;
        function easing(distance) {
            let t = distance / multiple;
            let d = moveMax * multiple; // 允许拖拽的最大距离
            let c = d; // 提示标签最大有效拖拽距离
            return c * Math.sin(t / d * (Math.PI / 2));
        }
        function setLeft() {
            if (!isLeft) {
                currentTarget.style.transform = `translateX(-${moveMax}px)`;
                isLeft = true;
            }
        }
        function setRight() {
            if (!isRight) {
                currentTarget.style.transform = 'translateX(0)';
                isRight = true;
            }
        }
        let move = type ? function(e) { // 右滑
            ev.cancelable && ev.preventDefault();
            ev.stopPropagation();
            let m = easing(e.touches[0].clientX - startX);
            if (m < moveMin) return;
            if (m > moveMax) return setRight();
            flag = m < moveAuto;
            currentTarget.style.transform = `translateX(${m - moveMax}px)`;
            e.cancelable && e.preventDefault();
            e.stopPropagation();
        } : function(e) { // 左滑
            ev.cancelable && ev.preventDefault();
            ev.stopPropagation();
            let m = easing(e.touches[0].clientX - startX);
            if (m > -moveMin) return;
            if (m < -moveMax)return setLeft();
            flag = m < -moveAuto;
            currentTarget.style.transform = `translateX(${m}px)`;
            e.cancelable && e.preventDefault();
            e.stopPropagation();
        };
        let end = function(e) {
            if (flag) {
                currentTarget.classList.add('active');
                currentTarget.style = `transition:.2s ease-in-out;transform: translateX(-${moveMax}px)`;
            } else {
                currentTarget.classList.remove('active');
                currentTarget.style = `transition:.2s ease-in-out;transform: translateX(0px)`;
            }
            currentTarget.addEventListener('transitionend', function removeT(e) {
                currentTarget.style.transition = null;
                currentTarget.removeEventListener('transitionend', removeT);
            }, false);
            typeof onEnd === 'function' && onEnd(flag, self);
            currentTarget.removeEventListener('touchmove', move);
            currentTarget.removeEventListener('touchend', end);
            return true;
        };
        currentTarget.addEventListener('touchmove', move, {
            passive: false
        }, false);
        currentTarget.addEventListener('touchend', end, {
            passive: false
        }, false);
    };
    setRight = _ => {
      let {
        onEnd
      } = this.props;
      let currentTarget = this.refs.main;
      currentTarget.classList.remove('active');
      currentTarget.style = `transition:.2s ease-in-out;transform: translateX(0px)`;
      currentTarget.addEventListener('transitionend', function removeT(e) {
        currentTarget.style.transition = '';
        // typeof onEnd === 'function' && onEnd(false, this);
        currentTarget.removeEventListener('transitionend', removeT);
      }, false);
    };
    render() {
        const {
            children,
            className,
            deleteBtn
        } = this.props;
        return (
            <div className={className || ''} style={{overflow:'hidden'}}>
                <div className={style.content}
                    ref="main">
                    <div className={style.body}>
                        {
                            children
                        }
                    </div>
                    <div ref="btn" className={style.deleteBtn} onClick={this.onDelete}>
                      {deleteBtn ? deleteBtn : (
                        <div className={style.addressDel}>
                          <div className={style.text}>删除</div>
                        </div>
                      )}
                    </div>
                </div>
            </div>
        )
    }
}