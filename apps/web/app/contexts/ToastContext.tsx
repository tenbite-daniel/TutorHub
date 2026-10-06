"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
	id: string;
	type: ToastType;
	message: string;
	title?: string;
	duration?: number;
}

interface ToastContextType {
	toasts: ToastItem[];
	showToast: (type: ToastType, message: string, options?: { title?: string; duration?: number }) => void;
	success: (message: string, options?: { title?: string; duration?: number }) => void;
	error: (message: string, options?: { title?: string; duration?: number }) => void;
	warning: (message: string, options?: { title?: string; duration?: number }) => void;
	info: (message: string, options?: { title?: string; duration?: number }) => void;
	dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<ToastItem[]>([]);

	const dismiss = useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	const showToast = useCallback(
		(type: ToastType, message: string, options?: { title?: string; duration?: number }) => {
			const id = Math.random().toString(36).substring(2, 9);
			const duration = options?.duration ?? 4000;

			const newToast: ToastItem = {
				id,
				type,
				message,
				title: options?.title,
				duration,
			};

			setToasts((prev) => [...prev, newToast]);

			if (duration > 0) {
				setTimeout(() => {
					dismiss(id);
				}, duration);
			}
		},
		[dismiss]
	);

	const success = useCallback(
		(message: string, options?: { title?: string; duration?: number }) => {
			showToast("success", message, options);
		},
		[showToast]
	);

	const error = useCallback(
		(message: string, options?: { title?: string; duration?: number }) => {
			showToast("error", message, options);
		},
		[showToast]
	);

	const warning = useCallback(
		(message: string, options?: { title?: string; duration?: number }) => {
			showToast("warning", message, options);
		},
		[showToast]
	);

	const info = useCallback(
		(message: string, options?: { title?: string; duration?: number }) => {
			showToast("info", message, options);
		},
		[showToast]
	);

	const getIcon = (type: ToastType) => {
		switch (type) {
			case "success":
				return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
			case "error":
				return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
			case "warning":
				return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
			case "info":
				return <Info className="w-5 h-5 text-blue-500 shrink-0" />;
		}
	};

	const getBorderColor = (type: ToastType) => {
		switch (type) {
			case "success":
				return "border-emerald-500";
			case "error":
				return "border-rose-500";
			case "warning":
				return "border-amber-500";
			case "info":
				return "border-blue-500";
		}
	};

	return (
		<ToastContext.Provider value={{ toasts, showToast, success, error, warning, info, dismiss }}>
			{children}

			{/* Toast Container */}
			<div
				aria-live="polite"
				className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
			>
				{toasts.map((toast) => (
					<div
						key={toast.id}
						className={`pointer-events-auto flex items-start gap-3 p-4 bg-white rounded-lg shadow-lg border-l-4 ${getBorderColor(
							toast.type
						)} border border-gray-100 transition-all duration-300 ease-in-out transform translate-y-0 opacity-100`}
						role="alert"
					>
						{getIcon(toast.type)}
						<div className="flex-1 min-w-0">
							{toast.title && (
								<h5 className="font-semibold text-sm text-gray-900 mb-0.5 leading-tight">
									{toast.title}
								</h5>
							)}
							<p className="text-sm text-gray-700 leading-snug break-words">
								{toast.message}
							</p>
						</div>
						<button
							onClick={() => dismiss(toast.id)}
							className="text-gray-400 hover:text-gray-600 p-0.5 rounded transition-colors focus:outline-none"
							aria-label="Dismiss toast"
						>
							<X className="w-4 h-4" />
						</button>
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
}
