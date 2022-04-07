class Modal {
    constructor(modalEl) {
        this.modalEl = modalEl;
        window.addEventListener("click", event => {
            if (event.target == this.modalEl) {
                this.hideModal();
            }
        });
        this.closeOnClick(...modalEl.querySelectorAll(".close"), ...modalEl.querySelectorAll(".modal-cancel"));
    }

    showModal() {
        this.modalEl.style.display = "block";
    }
    
    hideModal() {
        this.modalEl.style.display = "none";
    }
    
    closeOnClick(...els) {
        els.forEach(el => {
            el.addEventListener("click", e => {
                this.hideModal();
            });
        });
    }
}