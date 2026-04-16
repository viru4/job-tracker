import { JOB_STATUSES } from '../constants/jobStatus'

function Dashboard({ jobs = [] }) {
	const statsByStatus = jobs.reduce(
		(acc, job) => {
			if (JOB_STATUSES.includes(job.status)) {
				acc[job.status] += 1
			}
			return acc
		},
		Object.fromEntries(JOB_STATUSES.map((status) => [status, 0])),
	)

	const stats = {
		total: jobs.length,
		applied: statsByStatus.Applied,
		shortlisted: statsByStatus.Shortlisted,
		interview: statsByStatus.Interview,
		offer: statsByStatus.Offer,
		rejected: statsByStatus.Rejected,
	}

	const successRate = stats.total > 0 ? Math.round((stats.offer / stats.total) * 100) : 0

	const sourceCounts = jobs.reduce((acc, job) => {
		const source = job.applied_via
		if (!source) {
			return acc
		}

		acc[source] = (acc[source] ?? 0) + 1
		return acc
	}, {})

	const topSourceEntry = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])[0]
	const topSource = topSourceEntry?.[0] ?? 'N/A'

	const statCards = [
		{
			id: 'total',
			title: 'Total Applications',
			value: stats.total,
			accent: 'text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30',
			border: 'border-blue-200/70 dark:border-blue-800/60',
			dot: 'bg-blue-500',
		},
		{
			id: 'applied',
			title: 'Applied',
			value: stats.applied,
			accent:
				'text-slate-700 bg-slate-200 dark:text-slate-200 dark:bg-slate-700/80',
			border: 'border-slate-200/80 dark:border-slate-700',
			dot: 'bg-slate-500',
		},
		{
			id: 'interview',
			title: 'Interview',
			value: stats.interview,
			accent:
				'text-amber-700 bg-amber-100 dark:text-amber-200 dark:bg-amber-900/30',
			border: 'border-amber-200/70 dark:border-amber-800/60',
			dot: 'bg-amber-500',
		},
		{
			id: 'shortlisted',
			title: 'Shortlisted',
			value: stats.shortlisted,
			accent:
				'text-sky-700 bg-sky-100 dark:text-sky-200 dark:bg-sky-900/30',
			border: 'border-sky-200/70 dark:border-sky-800/60',
			dot: 'bg-sky-500',
		},
		{
			id: 'offer',
			title: 'Offer',
			value: stats.offer,
			accent:
				'text-emerald-700 bg-emerald-100 dark:text-emerald-200 dark:bg-emerald-900/30',
			border: 'border-emerald-200/70 dark:border-emerald-800/60',
			dot: 'bg-emerald-500',
		},
		{
			id: 'rejected',
			title: 'Rejected',
			value: stats.rejected,
			accent: 'text-rose-700 bg-rose-100 dark:text-rose-200 dark:bg-rose-900/30',
			border: 'border-rose-200/70 dark:border-rose-800/60',
			dot: 'bg-rose-500',
		},
		{
			id: 'success-rate',
			title: 'Success Rate',
			value: `${successRate}%`,
			accent:
				'text-indigo-700 bg-indigo-100 dark:text-indigo-200 dark:bg-indigo-900/30',
			border: 'border-indigo-200/70 dark:border-indigo-800/60',
			dot: 'bg-indigo-500',
		},
	]

	return (
		<section className="animate-fade-in-up rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/90 lg:p-5">
			<div className="mb-4 flex items-center justify-between">
				<div>
					<h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
						Dashboard
					</h2>
					<p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
						Top Source: {topSource}
					</p>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
				{statCards.map((card) => (
					<article
						key={card.id}
						className={`rounded-xl border ${card.border} bg-white/80 p-4 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] dark:bg-slate-900/80`}
					>
						<div className="flex items-start justify-between gap-2">
							<p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
								{card.title}
							</p>
							<span
								className={`inline-flex h-7 w-7 items-center justify-center rounded-md ${card.accent}`}
								aria-hidden="true"
							>
								<span className={`h-2 w-2 rounded-full ${card.dot}`} />
							</span>
						</div>

						<p className="mt-3 text-3xl font-semibold leading-none text-slate-900 dark:text-slate-100">
							{card.value}
						</p>
					</article>
				))}
			</div>
		</section>
	)
}

export default Dashboard
