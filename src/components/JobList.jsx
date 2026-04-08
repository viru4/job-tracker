import { JOB_STATUSES } from '../constants/jobStatus'
import { getSourceIcon } from '../utils/sourceIcons'

const statusClasses = {
	Applied:
		'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-300 dark:bg-slate-700/70 dark:text-slate-100 dark:ring-slate-600',
	Interview:
		'bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-300 dark:bg-amber-900/40 dark:text-amber-200 dark:ring-amber-700/80',
	Offer:
		'bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-200 dark:ring-emerald-700/80',
	Rejected:
		'bg-rose-100 text-rose-800 ring-1 ring-inset ring-rose-300 dark:bg-rose-900/40 dark:text-rose-200 dark:ring-rose-700/80',
}

function JobList({ jobs, deleteJob, updateJobStatus }) {
	if (jobs.length === 0) {
		return (
			<div className="rounded-2xl border border-slate-200/80 bg-white/95 p-12 text-center text-slate-500 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-400">
				No applications yet
			</div>
		)
	}

	return (
		<div className="animate-fade-in-up rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-sm backdrop-blur-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900/90 lg:p-7">
			<h2 className="mb-6 text-lg font-semibold text-slate-900 dark:text-slate-100">
				Applications
			</h2>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
				{jobs.map((job) => {
					const SourceIcon = getSourceIcon(job.applied_via)

					return (
						<article
						key={job.id}
						className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/70"
					>
						<div className="mb-2 flex items-start justify-between gap-2">
							<h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
								{job.company}
							</h3>
							<span
								className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none tracking-wide ${statusClasses[job.status] ?? statusClasses.Applied}`}
							>
								{job.status}
							</span>
						</div>

						<p className="text-sm text-slate-700 dark:text-slate-300">{job.role}</p>

						{job.date && (
							<p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
								Applied: {job.date}
							</p>
						)}

						{job.applied_via && (
							<p className="mt-1">
								<span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-600 ring-1 ring-inset ring-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
									<SourceIcon className="h-4 w-4" aria-hidden="true" />
									{job.applied_via}
								</span>
							</p>
						)}

						{job.link && (
							<a
								href={job.link}
								target="_blank"
								rel="noreferrer"
								className="mt-3 inline-block rounded-md text-sm font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 dark:text-blue-400"
							>
								View posting
							</a>
						)}

						{job.notes && (
							<p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">
								{job.notes}
							</p>
						)}

						<div className="mt-4 flex items-center gap-2">
							<select
								value={job.status}
								onChange={(event) => updateJobStatus(job.id, event.target.value)}
								className="flex-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm outline-none transition duration-200 focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800"
							>
								{JOB_STATUSES.map((statusOption) => (
									<option key={statusOption}>{statusOption}</option>
								))}
							</select>

							<button
								type="button"
								onClick={() => deleteJob(job.id)}
								className="rounded-lg bg-rose-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition duration-200 hover:scale-105 hover:bg-rose-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/30"
							>
								Delete
							</button>
						</div>
					</article>
					)
				})}
			</div>
		</div>
	)
}

export default JobList