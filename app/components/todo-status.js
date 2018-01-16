import SepCon from 'sepcon';
import {COMP_TODO_STATUS, TODO_STATUS, CLASSNAME_SELECTED} from 'app/constants';

export default SepCon.createComponent({id: COMP_TODO_STATUS}, {
    state: {
        props: {
            local: {
                status: 0
            }
        },
        methods: {
            local: {
                setStatus(next, status) {
                    if (status >= 0 && status <= 2) {
                        next(status);
                    }
                }
            }
        }
    },
    view: {
        events: [
            {
                selector: '.status-option',
                event: 'click',
                callback: 'handleStatus'
            }
        ],
        lifecycle: {
            render(changed) {
                const idx = this.props.status || 0;
                if (changed === true) {
                    return this.buildStatusOptionsHTML(idx);
                }
                else {
                    this.updateSelectedOptionClass(idx);
                    return;
                }
            },
        },

        /**
         * will be invoked after any change made at the <select> input
         * @param e
         * @private
         */
        handleStatus(e) {
            const status = parseInt(e.currentTarget.getAttribute('data-value'));
            this.methods.setStatus(status);
        },

        buildStatusOptionsHTML(idx) {
            return `<div class="${COMP_TODO_STATUS}">
                        <div class="status-select">
                            ${Object.keys(TODO_STATUS.labels).map(status => {
                                const isSelected = parseInt(status) === parseInt(idx);
                                const divStatusClass = TODO_STATUS.labels[status].toLowerCase().replace(/ /g, '-');
                                const spanIconClass = TODO_STATUS.icons[status];
                
                                return `<div 
                                            class="status-option ${divStatusClass} ${isSelected ? CLASSNAME_SELECTED: ''}" 
                                            data-value="${status}"
                                        >
                                            <span class="icon ${spanIconClass}"></span>
                                            <span class="label">${TODO_STATUS.labels[status]}</span>
                                        </div>`;
                            }).join('')}
                        </div>
                    </div>`;
        },
        updateSelectedOptionClass(idx) {
            const target = '[data-value="'+idx+'"]';
            const otherStatuses = Array.prototype.slice.call(this.element.querySelectorAll('.status-option:not('+target+')'));
            otherStatuses.forEach(status => {
                status.classList.remove(CLASSNAME_SELECTED);
            });
            const currentStatus = this.element.querySelector('.status-option'+target);
            if(currentStatus) {
                currentStatus.classList.add(CLASSNAME_SELECTED);
            }
        }
    }
})
;