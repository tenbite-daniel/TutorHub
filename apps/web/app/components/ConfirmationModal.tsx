"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, X, HelpCircle } from "lucide-react";

export interface ConfirmationModalProps {
	isOpen: boolean;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	variant?: "primary" | "danger" | "success";
	inputLabel?: string;
	inputPlaceholder?: string;
	requireInput?: boolean;
	showInput?: boolean;
	initialInputValue?: string;
	onConfirm: (inputValue?: string) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

export default function ConfirmationModal({
	isOpen,
	title,
	message,
	confirmText = "Confirm",
	cancelText = "Cancel",
	variant = "primary",
	inputLabel,
	inputPlaceholder,
	requireInput = false,
	showInput = false,
	initialInputValue = "",
	onConfirm,
	onCancel,
	isLoading = false,
}: ConfirmationModalProps) {
	const [inputValue, setInputValue] = useState(initialInputValue);

	useEffect(() => {
		if (isOpen) {
			setInputValue(initialInputValue);
		}
	}, [isOpen, initialInputValue]);

	if (!isOpen) return null;

	const getIcon = () => {
		switch (variant) {
			case "danger":
				return (
					<div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-4 mx-auto">
						<AlertCircle className="w-6 h-6" />
					</div>
				);
			case "success":
				return (
					<div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 mx-auto">
						<CheckCircle2 className="w-6 h-6" />
					</div>
				);
			default:
				return (
					<div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-4 mx-auto">
						<HelpCircle className="w-6 h-6" />
					</div>
				);
		}
	};

	const getButtonClass = () => {
		switch (variant) {
			case "danger":
				return "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500";
			case "success":
				return "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500";
			default:
				return "bg-orange-600 hover:bg-orange-700 text-white focus:ring-orange-500";
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (requireInput && !inputValue.trim()) return;
		onConfirm(inputValue);
	};

	return (
		<div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
			<div
				className="relative bg-white rounded-xl max-w-md w-full p-6 shadow-2xl transition-all"
				role="dialog"
				aria-modal="true"
			>
				<button
					type="button"
					onClick={onCancel}
					className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
					aria-label="Close"
				>
					<X className="w-5 h-5" />
				</button>

				{getIcon()}

				<h3 className="text-lg font-bold text-gray-900 text-center mb-2">
					{title}
				</h3>

				<p className="text-sm text-gray-600 text-center mb-5 leading-relaxed">
					{message}
				</p>

				<form onSubmit={handleSubmit} className="space-y-4">
					{showInput && (
						<div>
							{inputLabel && (
								<label className="block text-xs font-medium text-gray-700 mb-1.5">
									{inputLabel}
								</label>
							)}
							<textarea
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								placeholder={inputPlaceholder}
								rows={3}
								required={requireInput}
								className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
							/>
						</div>
					)}

					<div className="flex gap-3 justify-end pt-2">
						<button
							type="button"
							onClick={onCancel}
							disabled={isLoading}
							className="flex-1 py-2.5 px-4 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50"
						>
							{cancelText}
						</button>
						<button
							type="submit"
							disabled={isLoading || (requireInput && !inputValue.trim())}
							className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${getButtonClass()}`}
						>
							{isLoading ? "Processing..." : confirmText}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
