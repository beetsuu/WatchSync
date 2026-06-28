import React from 'react';

function Modal({ onClose, children }: { onClose: () => void, children: React.ReactNode }) {
    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            onClick={onClose}
        >
            <div onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}
export default Modal;