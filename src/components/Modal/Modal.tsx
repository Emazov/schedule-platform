import React, { useEffect, useRef } from 'react';
import './Modal.css';

type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		const handleClickOutside = (e: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
			document.addEventListener('mousedown', handleClickOutside);
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.removeEventListener('mousedown', handleClickOutside);
			document.body.style.overflow = 'auto';
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className='modal-overlay'>
			<div className='modal-container' ref={modalRef}>
				<div className='modal-header'>
					<h2>{title}</h2>
					<button className='modal-close' onClick={onClose}>
						&times;
					</button>
				</div>
				<div className='modal-content'>{children}</div>
			</div>
		</div>
	);
};

export default Modal;
