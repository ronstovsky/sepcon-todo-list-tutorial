import SepCon from 'sepcon';
import {COMP_TODO_TITLE} from 'app/constants';

export default SepCon.createComponent({id: COMP_TODO_TITLE}, {
    state: {
        props: {
            local: {
                value: ''
            }
        }
    },
    view: {
        lifecycle: {
            render() {
                return `<h4 class="${COMP_TODO_TITLE}">${this._sanitize(this.props.value)}</h4>`;
            },
        },

        /**
         * strips all HTML tags from a string, to prevent XSS attempts
         * @param val {string}
         * @returns {string}
         * @private
         */
        _sanitize(val) {
            if(typeof val !== 'string') {
                return 'Invalid Value';
            }
            return val.replace(/(<([^>]+)>)/ig,"");
        }
    }
});