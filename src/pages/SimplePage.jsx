import React from 'react'

export default function SimplePage({ title }) {
	return (
		<div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
			<h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{title}</h1>
		</div>
	)
}
