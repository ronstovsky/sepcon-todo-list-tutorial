import SepCon from 'sepcon';
import {COMP_TODO_REMOVE} from 'app/constants';


export default SepCon.createComponent({id: COMP_TODO_REMOVE}, {
    view: {
        events: [
            {
                selector: 'button',
                event: 'click',
                callback: 'handleClick'
            }
        ],
        lifecycle: {
            render() {
                return `<div class="${COMP_TODO_REMOVE}">
                    <button><span class="icon-cross"></span></button>
                </div>`;
            }
        },

        /**
         * will be invoked after button clicked
         * @param e
         * @private
         */
        handleClick(e) {
            if(this.methods.remove) {
                this.methods.remove();
            }
        }
    }
})
;