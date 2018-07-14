import React, {Component} from 'react'
import style from './index.css';
import PropTypes from 'prop-types'
export default class DeleteBySlide extends Component {
    static propTypes = {
        onDelete: PropTypes.func, // 删除回调
        width: PropTypes.number, // 按钮宽度 px
        autoDistance: PropTypes.number // 自动完成滑动宽度 px
    };

    onDelete = (ev) => {
        const {
            onDelete
        } = this.props;
        onDelete && onDelete(ev);
    };
    onStart(ev) {
        const {
            width,
            autoDistance
        } = this.props;
        let moveMax = width || 70;
        console.log(moveMax);
        let moveAuto = autoDistance || 15;
        let moveMin = 5;
        let multiple = 3;
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
            let m = easing(e.touches[0].clientX - startX);
            if (m < moveMin) return;
            if (m > moveMax) return setRight();
            flag = m < moveAuto;
            currentTarget.style.transform = `translateX(${m - moveMax}px)`;
            e.cancelable && e.preventDefault();
            e.stopPropagation();
        } : function(e) { // 左滑
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
    }
    render() {
        const {
            children,
            className,
            width
        } = this.props;
        return (
            <div style={{overflow:'hidden'}}>
                <div
                    className={className ? style.content + ` ${className}` : style.content}
                    onTouchStart = { ev => this.onStart(ev) }
                >
                    <div className={style.body}>
                        {
                            children
                        }
                    </div>
                    <div className={style.deleteBtn} style={width && {width}} onClick={this.onDelete}>
                        <div className={style.btn}>删除</div>
                    </div>
                </div>
            </div>
        )
    }
}