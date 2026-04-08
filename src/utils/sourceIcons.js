import { Briefcase, Globe, Link, Users } from 'lucide-react'
import { createElement } from 'react'

function LinkedInBrandIcon(props) {
	return createElement(
		'svg',
		{ viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': 'true', ...props },
		createElement('path', {
			d: 'M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.11 1 2.5 1s2.48 1.12 2.48 2.5ZM0.5 8h4V23h-4V8Zm7 0h3.83v2.05h.05c.53-1 1.84-2.05 3.8-2.05C19.24 8 21 10.36 21 14.2V23h-4v-7.32c0-1.74-.03-3.98-2.42-3.98-2.43 0-2.8 1.9-2.8 3.86V23h-4V8Z',
		}),
	)
}

export function getSourceIcon(source) {
	const normalizedSource = source?.trim().toLowerCase()

	switch (normalizedSource) {
		case 'linkedin':
			return LinkedInBrandIcon
		case 'naukri':
			return Briefcase
		case 'careers page':
			return Globe
		case 'referral':
			return Users
		default:
			return Link
	}
}
