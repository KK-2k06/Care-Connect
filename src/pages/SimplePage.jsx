import React from 'react'
import CommunityChat from '../components/CommunityChat.jsx'

export default function SimplePage({ title }) {
	// Show community chat for P2P support
	if (title === 'P2P') {
		return <CommunityChat />
	}
	
	return (
		<div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
			<h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{title}</h1>
		</div>
	)
}
