import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

interface ModalTriggerProps {
    children: React.ReactNode;
    className?: string;
}

interface ModalBodyProps {
    children: React.ReactNode;
    className?: string;
}

interface ModalContentProps {
    children: React.ReactNode;
}

interface ModalFooterProps {
    children: React.ReactNode;
    className?: string;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative z-50 bg-zinc-900 rounded-lg shadow-xl max-w-4xl w-full mx-4">
                {children}
            </div>
        </div>
    );
}

export function ModalTrigger({ children, className = "" }: ModalTriggerProps) {
    return <div className={className}>{children}</div>;
}

export function ModalBody({ children, className = "" }: ModalBodyProps) {
    return <div className={`p-6 ${className}`}>{children}</div>;
}

export function ModalContent({ children }: ModalContentProps) {
    return <div>{children}</div>;
}

export function ModalFooter({ children, className = "" }: ModalFooterProps) {
    return (
        <div className={`flex justify-end gap-4 p-4 border-t border-zinc-800 ${className}`}>
            {children}
        </div>
    );
} 