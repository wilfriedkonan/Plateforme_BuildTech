// ============================================================
// COMPOSANTS UI PARTAGÉS — Style COCOPROJECTS
// ============================================================
// Copier ce fichier dans : components/ui/shared.tsx

import React from "react"

// ── Badges statut ────────────────────────────────────────────

interface BadgeProps {
  children: React.ReactNode
  className?: string
}

export function BadgeActif({ children, className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
      {children}
    </span>
  )
}

export function BadgeInactif({ children, className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
      {children}
    </span>
  )
}

export function BadgePayee({ children, className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 ${className}`}>
      ✓ {children}
    </span>
  )
}

export function BadgeEnAttente({ children, className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 ${className}`}>
      ⏳ {children}
    </span>
  )
}

export function BadgeEnRetard({ children, className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 ${className}`}>
      ⚠ {children}
    </span>
  )
}

export function BadgeCode({ children, className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-teal-50 text-teal-700 border border-teal-200 ${className}`}>
      {children}
    </span>
  )
}

export function BadgeSpecialite({ label }: { label: string }) {
  const colors: Record<string, string> = {
    "Alimentaire": "bg-orange-100 text-orange-700",
    "Matériaux":   "bg-yellow-100 text-yellow-700",
    "Informatique":"bg-blue-100 text-blue-700",
    "Logistique":  "bg-purple-100 text-purple-700",
    "Fournitures": "bg-pink-100 text-pink-700",
    "Services":    "bg-teal-100 text-teal-700",
    "Autre":       "bg-gray-100 text-gray-600",
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${colors[label] ?? "bg-gray-100 text-gray-600"}`}>
      {label}
    </span>
  )
}

// ── Boutons actions ──────────────────────────────────────────

interface ActionBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function BtnEdit({ children, className = "", ...props }: ActionBtnProps) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm transition-colors ${className}`}
    >
      {children}
    </button>
  )
}

export function BtnDelete({ children, className = "", ...props }: ActionBtnProps) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm transition-colors ${className}`}
    >
      {children}
    </button>
  )
}

export function BtnView({ children, className = "", ...props }: ActionBtnProps) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-sm transition-colors ${className}`}
    >
      {children}
    </button>
  )
}

export function BtnPrimary({ children, className = "", disabled, ...props }: ActionBtnProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors ${className}`}
    >
      {children}
    </button>
  )
}

export function BtnSecondary({ children, className = "", ...props }: ActionBtnProps) {
  return (
    <button
      {...props}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-colors ${className}`}
    >
      {children}
    </button>
  )
}

export function BtnDanger({ children, className = "", disabled, ...props }: ActionBtnProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors ${className}`}
    >
      {children}
    </button>
  )
}

// ── Champs formulaire ────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  required?: boolean
  hint?: string
}

export function FormInput({ label, error, required, hint, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...props}
        className={`h-9 px-3 rounded-lg border text-sm transition-colors outline-none
          ${error
            ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-200"
            : "border-gray-300 bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-200"
          } ${className}`}
      />
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-500 flex items-center gap-1">⚠ {error}</p>}
    </div>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  required?: boolean
  options: { value: string; label: string }[]
}

export function FormSelect({ label, error, required, options, className = "", ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        {...props}
        className={`h-9 px-3 rounded-lg border text-sm transition-colors outline-none appearance-none bg-white cursor-pointer
          ${error
            ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-200"
            : "border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-200"
          } ${className}`}
      >
        <option value="">Sélectionner...</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 flex items-center gap-1">⚠ {error}</p>}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  required?: boolean
}

export function FormTextarea({ label, error, required, className = "", ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        {...props}
        className={`px-3 py-2 rounded-lg border text-sm transition-colors outline-none resize-none
          ${error
            ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-1 focus:ring-red-200"
            : "border-gray-300 bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-200"
          } ${className}`}
      />
      {error && <p className="text-xs text-red-500 flex items-center gap-1">⚠ {error}</p>}
    </div>
  )
}

// ── Modale générique ─────────────────────────────────────────

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  size?: "sm" | "md" | "lg" | "xl"
  children: React.ReactNode
}

export function Modal({ isOpen, onClose, title, size = "md", children }: ModalProps) {
  if (!isOpen) return null
  const widths = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${widths[size]} bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors text-lg"
          >
            ×
          </button>
        </div>
        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}

// ── Stat card ────────────────────────────────────────────────

interface StatCardProps {
  icon: string
  label: string
  value: string | number
  color?: "teal" | "green" | "orange" | "red" | "blue"
}

export function StatCard({ icon, label, value, color = "teal" }: StatCardProps) {
  const colors = {
    teal:   "bg-teal-700 text-white",
    green:  "bg-emerald-500 text-white",
    orange: "bg-amber-500 text-white",
    red:    "bg-red-500 text-white",
    blue:   "bg-blue-500 text-white",
  }
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm ${colors[color]}`}>
      <span className="text-base">{icon}</span>
      <div className="flex flex-col leading-tight">
        <span className="text-lg font-bold leading-none">{value}</span>
        <span className="text-xs opacity-80">{label}</span>
      </div>
    </div>
  )
}

// ── Avatar initiales ─────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-teal-500","bg-blue-500","bg-purple-500",
  "bg-orange-500","bg-pink-500","bg-emerald-500"
]

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const initiale = name?.charAt(0).toUpperCase() ?? "?"
  const charCode = name ? name.charCodeAt(0) : 0
  const colorIndex = charCode % AVATAR_COLORS.length
  const color = AVATAR_COLORS[colorIndex]
  const sizes = { sm: "w-7 h-7 text-xs", md: "w-9 h-9 text-sm", lg: "w-14 h-14 text-xl" }
  return (
    <span className={`inline-flex items-center justify-center rounded-full font-bold text-white ${color} ${sizes[size]}`}>
      {initiale}
    </span>
  )
}
