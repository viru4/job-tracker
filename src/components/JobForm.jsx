import { useState } from 'react'
import { JOB_STATUSES } from '../constants/jobStatus'

const initialFormState = {
	company: '',
	role: '',
	link: '',
	status: 'Applied',
	appliedVia: 'LinkedIn',
	customSource: '',
	date: '',
	notes: '',
}

const normalizeUrl = (value) => {
	const trimmed = value.trim()
	if (!trimmed) {
		return ''
	}

	if (/^https?:\/\//i.test(trimmed)) {
		return trimmed
	}

	return `https://${trimmed}`
}

function JobForm({ onAddJob, isAdding = false }) {
	const [formData, setFormData] = useState(initialFormState)
	const [linkError, setLinkError] = useState('')

	const handleChange = (event) => {
		const { name, value } = event.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		setLinkError('')
		if (!formData.appliedVia || !formData.appliedVia.trim()) {
			return
		}

		const finalSource =
			formData.appliedVia === 'Other'
				? formData.customSource.trim()
				: formData.appliedVia

		if (!finalSource) {
			return
		}

		const normalizedLink = normalizeUrl(formData.link)
		if (normalizedLink) {
			try {
				new URL(normalizedLink)
			} catch {
				setLinkError('Please enter a valid job link.')
				return
			}
		}

		const payload = {
			...formData,
			link: normalizedLink,
			appliedVia: finalSource,
			applied_via: finalSource,
		}

		const didAddSucceed = await onAddJob(payload)
		if (didAddSucceed) {
			setFormData(initialFormState)
		}
	}

	return (
		<div className="animate-fade-in-up rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-sm backdrop-blur-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900/90 lg:p-7">
			<h2 className="mb-6 text-lg font-semibold text-slate-900 dark:text-slate-100">
				Add New Job
			</h2>

			<form onSubmit={handleSubmit} className="space-y-5">
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<input
						type="text"
						name="company"
						placeholder="Company"
						value={formData.company}
						onChange={handleChange}
						className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition duration-200 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:placeholder:text-slate-500"
						required
					/>

					<input
						type="text"
						name="role"
						placeholder="Role"
						value={formData.role}
						onChange={handleChange}
						className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition duration-200 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:placeholder:text-slate-500"
						required
					/>

					<input
						type="text"
						name="link"
						placeholder="Job Link"
						value={formData.link}
						onChange={handleChange}
						inputMode="url"
						className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition duration-200 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:placeholder:text-slate-500"
					/>

					<select
						name="status"
						value={formData.status}
						onChange={handleChange}
						className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition duration-200 focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800"
					>
						{JOB_STATUSES.map((statusOption) => (
							<option key={statusOption}>{statusOption}</option>
						))}
					</select>

					<select
						name="appliedVia"
						value={formData.appliedVia}
						onChange={handleChange}
						className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition duration-200 focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800"
						required
					>
						<option>LinkedIn</option>
						<option>Naukri</option>
						<option>Careers Page</option>
						<option>Referral</option>
						<option>Other</option>
					</select>

					{formData.appliedVia === 'Other' && (
						<input
							type="text"
							name="customSource"
							placeholder="Enter source platform"
							value={formData.customSource}
							onChange={handleChange}
							className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition duration-200 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:placeholder:text-slate-500"
							required
						/>
					)}

					<input
						type="date"
						name="date"
						value={formData.date}
						onChange={handleChange}
						className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition duration-200 focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800"
					/>
				</div>

				{linkError && (
					<p className="text-sm text-rose-600 dark:text-rose-300">{linkError}</p>
				)}

				<textarea
					name="notes"
					placeholder="Notes"
					value={formData.notes}
					onChange={handleChange}
					rows={4}
					className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition duration-200 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:placeholder:text-slate-500"
				/>

				<button
					type="submit"
					disabled={isAdding}
					className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-blue-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-70"
				>
					{isAdding ? 'Adding...' : 'Add Job'}
				</button>
			</form>
		</div>
	)
}

export default JobForm