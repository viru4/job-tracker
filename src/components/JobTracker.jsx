import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import JobForm from './JobForm'
import JobList from './JobList'
import { JOB_STATUS_FILTERS } from '../constants/jobStatus'
import { signOut } from '../lib/auth'
import {
	addJob as addJobApi,
	deleteJob as deleteJobApi,
	fetchJobs as fetchJobsApi,
	updateJobStatus as updateJobStatusApi,
} from '../lib/jobApi'

const Dashboard = lazy(() => import('./Dashboard'))
const KanbanBoard = lazy(() => import('./KanbanBoard'))

const toUiJob = (job) => ({
	...job,
	date: job.applied_date ?? '',
})

const toApiJobPayload = (jobData) => ({
	company: jobData.company,
	role: jobData.role,
	link: jobData.link,
	status: jobData.status,
	applied_via: jobData.applied_via ?? jobData.appliedVia,
	applied_date: jobData.date || null,
	notes: jobData.notes,
})

export default function JobTracker() {
	const [jobs, setJobs] = useState([])
	const [searchTerm, setSearchTerm] = useState('')
	const [statusFilter, setStatusFilter] = useState('All')
	const [appliedViaFilter, setAppliedViaFilter] = useState('All')
	const [viewMode, setViewMode] = useState('list')
	const [isLoading, setIsLoading] = useState(true)
	const [isAdding, setIsAdding] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [toasts, setToasts] = useState([])

	const addToast = (message, type = 'info') => {
		const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
		setToasts((prev) => [...prev, { id, message, type }])
		window.setTimeout(() => {
			setToasts((prev) => prev.filter((toast) => toast.id !== id))
		}, 2800)
	}

	useEffect(() => {
		const loadJobs = async () => {
			setIsLoading(true)
			setErrorMessage('')
			try {
				const data = await fetchJobsApi()
				const normalizedJobs = (data ?? []).map(toUiJob)
				setJobs(normalizedJobs)
			} catch {
				setErrorMessage('Could not load jobs. Please refresh and try again.')
			} finally {
				setIsLoading(false)
			}
		}

		loadJobs()
	}, [])

	const handleAddJob = async (jobData) => {
		setIsAdding(true)
		const optimisticId = `temp-${Date.now()}`
		const optimisticJob = {
			id: optimisticId,
			...toApiJobPayload(jobData),
			date: jobData.date || '',
		}

		setErrorMessage('')
		setJobs((prevJobs) => [optimisticJob, ...prevJobs])

		try {
			await addJobApi(toApiJobPayload(jobData))
			const latestJobs = await fetchJobsApi()
			setJobs((latestJobs ?? []).map(toUiJob))
			addToast('Job added successfully.', 'success')
			return true
		} catch (err) {
			setJobs((prevJobs) => prevJobs.filter((job) => job.id !== optimisticId))
			setErrorMessage(err.message || 'Could not add job. Please try again.')
			addToast(err.message || 'Could not add job. Please try again.', 'error')
			return false
		} finally {
			setIsAdding(false)
		}
	}

	const handleDeleteJob = async (id) => {
		let removedJob = null
		setErrorMessage('')
		setJobs((prevJobs) => {
			removedJob = prevJobs.find((job) => job.id === id) ?? null
			return prevJobs.filter((job) => job.id !== id)
		})

		try {
			await deleteJobApi(id)
			addToast('Job deleted.', 'success')
		} catch {
			if (removedJob) {
				setJobs((prevJobs) => [removedJob, ...prevJobs])
			}
			setErrorMessage('Could not delete job. Please try again.')
			addToast('Could not delete job. Please try again.', 'error')
		}
	}

	const handleStatusChange = async (id, status) => {
		const previousStatus = jobs.find((job) => job.id === id)?.status
		setErrorMessage('')
		setJobs((prevJobs) =>
			prevJobs.map((job) => (job.id === id ? { ...job, status } : job)),
		)

		try {
			const updatedJob = await updateJobStatusApi(id, status)
			setJobs((prevJobs) =>
				prevJobs.map((job) =>
					job.id === id ? { ...job, ...toUiJob(updatedJob) } : job,
				),
			)
			addToast('Status updated.', 'success')
		} catch (err) {
			if (previousStatus) {
				setJobs((prevJobs) =>
					prevJobs.map((job) =>
						job.id === id ? { ...job, status: previousStatus } : job,
					),
				)
			}
			const message =
				err?.message || 'Could not update status. Please try again.'
			setErrorMessage(message)
			addToast(message, 'error')
		}
	}

	const filteredJobs = useMemo(() => {
		const query = searchTerm.trim().toLowerCase()

		return jobs.filter((job) => {
			const company = (job.company ?? '').toLowerCase()
			const role = (job.role ?? '').toLowerCase()
			const status = job.status ?? ''
			const appliedVia = job.applied_via ?? ''

			const matchesSearch =
				query.length === 0 || company.includes(query) || role.includes(query)
			const matchesStatus = statusFilter === 'All' || status === statusFilter
			const matchesAppliedVia =
				appliedViaFilter === 'All' || appliedVia === appliedViaFilter

			return matchesSearch && matchesStatus && matchesAppliedVia
		})
	}, [jobs, searchTerm, statusFilter, appliedViaFilter])

	return (
		<div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-blue-100 text-slate-800 transition-colors duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 dark:text-slate-100">
			<div className="pointer-events-none absolute inset-0 -z-0">
				<div className="absolute -top-20 left-1/3 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl dark:bg-blue-500/10" />
				<div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-slate-300/30 blur-3xl dark:bg-slate-500/10" />
			</div>

			<header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl transition-colors duration-300 dark:border-slate-700/70 dark:bg-slate-900/70">
				<div className="mx-auto max-w-5xl px-4 py-4 lg:px-6 flex items-center justify-between">
					<h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
						Job Tracker
					</h1>
					<button
						onClick={async () => {
							try {
								await signOut()
							} catch (err) {
								console.error('Sign out failed:', err)
							}
						}}
						className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition"
					>
						Sign Out
					</button>
				</div>
			</header>

			<main className="relative z-10 mx-auto max-w-5xl px-4 py-8 lg:px-6 lg:py-10">
				<div className="space-y-7 lg:space-y-8">
					<section className="rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
						<Suspense
							fallback={
								<div className="rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/90">
									<div className="h-6 w-40 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
								</div>
							}
						>
							<Dashboard jobs={jobs} />
						</Suspense>
					</section>

					<section className="rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
						<JobForm onAddJob={handleAddJob} isAdding={isAdding} />
					</section>

					{errorMessage && (
						<div
							role="alert"
							className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800/60 dark:bg-rose-900/20 dark:text-rose-200"
						>
							{errorMessage}
						</div>
					)}

					<section className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/90">
						<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-2">
							<label htmlFor="job-search" className="sr-only">
								Search by company or role
							</label>
							<input
								id="job-search"
								type="text"
								value={searchTerm}
								onChange={(event) => setSearchTerm(event.target.value)}
								placeholder="Search by company or role"
								className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition duration-200 placeholder:text-slate-400 focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-500/20 md:max-w-md dark:border-slate-600 dark:bg-slate-800 dark:placeholder:text-slate-500"
							/>

							<label htmlFor="status-filter" className="sr-only">
								Filter by status
							</label>
							<select
								id="status-filter"
								value={statusFilter}
								onChange={(event) => setStatusFilter(event.target.value)}
								className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition duration-200 focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-500/20 md:w-56 dark:border-slate-600 dark:bg-slate-800"
							>
								{JOB_STATUS_FILTERS.map((statusOption) => (
									<option key={statusOption}>{statusOption}</option>
								))}
							</select>

							<label htmlFor="applied-via-filter" className="sr-only">
								Filter by applied via
							</label>
							<select
								id="applied-via-filter"
								value={appliedViaFilter}
								onChange={(event) => setAppliedViaFilter(event.target.value)}
								className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition duration-200 focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-500/20 md:w-56 dark:border-slate-600 dark:bg-slate-800"
							>
								<option>All</option>
								<option>LinkedIn</option>
								<option>Naukri</option>
								<option>Careers Page</option>
								<option>Referral</option>
								<option>Other</option>
							</select>
						</div>

						<div className="mt-3 inline-flex w-fit items-center rounded-full border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-800/80">
							<button
								type="button"
								onClick={() => setViewMode('list')}
								className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700/70 dark:hover:text-slate-100'}`}
							>
								List View
							</button>
							<button
								type="button"
								onClick={() => setViewMode('kanban')}
								className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${viewMode === 'kanban' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700/70 dark:hover:text-slate-100'}`}
							>
								Kanban View
							</button>
						</div>
					</section>

					<section className="rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
						{isLoading ? (
							<div className="rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm backdrop-blur-sm transition-opacity duration-300 dark:border-slate-700 dark:bg-slate-900/90">
								<div className="mb-5 h-6 w-36 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
									{Array.from({ length: 6 }).map((_, index) => (
										<div
											key={index}
											className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/70"
										>
											<div className="mb-3 h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
											<div className="mb-2 h-3 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
											<div className="h-3 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
										</div>
									))}
								</div>
							</div>
						) : filteredJobs.length === 0 ? (
							<div className="rounded-2xl border border-slate-200/80 bg-white/95 p-10 text-center shadow-sm backdrop-blur-sm transition-opacity duration-300 dark:border-slate-700 dark:bg-slate-900/90">
								<div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
									<svg
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="1.8"
										className="h-6 w-6"
										aria-hidden="true"
									>
										<path d="M3 7h18" />
										<path d="M6 7v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7" />
										<path d="M9 11h6" />
										<path d="M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1Z" />
									</svg>
								</div>
								<p className="text-base font-medium text-slate-700 dark:text-slate-200">
									No matching applications found
								</p>
								<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
									Try adjusting your search text or status filter.
								</p>
							</div>
						) : viewMode === 'kanban' ? (
							<Suspense
								fallback={
									<div className="rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/90">
										<div className="h-6 w-44 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
									</div>
								}
							>
								<KanbanBoard
									jobs={filteredJobs}
									updateJobStatus={handleStatusChange}
								/>
							</Suspense>
						) : (
							<JobList
								jobs={filteredJobs}
								deleteJob={handleDeleteJob}
								updateJobStatus={handleStatusChange}
							/>
						)}
					</section>
				</div>
			</main>

			<div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-2">
				{toasts.map((toast) => (
					<div
						key={toast.id}
						role="status"
						className={`pointer-events-auto rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur-sm transition ${
							toast.type === 'error'
								? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800/60 dark:bg-rose-900/30 dark:text-rose-200'
								: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-900/30 dark:text-emerald-200'
						}`}
					>
						{toast.message}
					</div>
				))}
			</div>
		</div>
	)
}
