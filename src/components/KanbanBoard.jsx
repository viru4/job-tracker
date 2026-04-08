import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { JOB_STATUSES } from '../constants/jobStatus'
import { getSourceIcon } from '../utils/sourceIcons'

const columnStyles = {
	Applied: {
		container: 'bg-slate-100/80 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700',
		badge: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
	},
	Interview: {
		container: 'bg-amber-50/80 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800/60',
		badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200',
	},
	Offer: {
		container: 'bg-emerald-50/80 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800/60',
		badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200',
	},
	Rejected: {
		container: 'bg-rose-50/80 border-rose-200 dark:bg-rose-950/20 dark:border-rose-800/60',
		badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200',
	},
}

const statusTagClasses = {
	Applied:
		'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-300 dark:bg-slate-700/70 dark:text-slate-100 dark:ring-slate-600',
	Interview:
		'bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-300 dark:bg-amber-900/40 dark:text-amber-200 dark:ring-amber-700/80',
	Offer:
		'bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-200 dark:ring-emerald-700/80',
	Rejected:
		'bg-rose-100 text-rose-800 ring-1 ring-inset ring-rose-300 dark:bg-rose-900/40 dark:text-rose-200 dark:ring-rose-700/80',
}

function KanbanBoard({ jobs = [], updateJobStatus }) {
	const jobsByStatus = {
		Applied: [],
		Interview: [],
		Offer: [],
		Rejected: [],
	}

	for (const job of jobs) {
		const status = job?.status
		const targetStatus = JOB_STATUSES.includes(status) ? status : 'Applied'
		jobsByStatus[targetStatus].push(job)
	}

	const handleDragEnd = (result) => {
		const { source, destination, draggableId } = result

		if (!destination) {
			return
		}

		const isSameColumn = source.droppableId === destination.droppableId
		const isSameIndex = source.index === destination.index
		if (isSameColumn && isSameIndex) {
			return
		}

		const destinationStatus = destination.droppableId
		if (!JOB_STATUSES.includes(destinationStatus)) {
			return
		}

		const jobId = Number(draggableId)
		if (Number.isNaN(jobId) || typeof updateJobStatus !== 'function') {
			return
		}

		updateJobStatus(jobId, destinationStatus)
	}

	return (
		<section className="animate-fade-in-up rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/90 lg:p-5">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
					Pipeline Board
				</h2>
			</div>

			<DragDropContext onDragEnd={handleDragEnd}>
				<div className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 scroll-smooth [scrollbar-width:thin]">
					{JOB_STATUSES.map((status) => {
						const statusJobs = jobsByStatus[status] ?? []
						const style = columnStyles[status]

						return (
							<Droppable key={status} droppableId={status}>
								{(provided, snapshot) => (
									<div
										ref={provided.innerRef}
										{...provided.droppableProps}
										className={`min-h-[360px] w-[85vw] min-w-[260px] shrink-0 snap-start rounded-xl border p-3 transition-colors duration-200 sm:w-[280px] ${style.container} ${snapshot.isDraggingOver ? 'ring-2 ring-blue-400/60' : ''}`}
									>
										<div className="mb-3 flex items-center justify-between">
											<h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
												{status}
											</h3>
											<span
												className={`rounded-full px-2 py-0.5 text-xs font-semibold ${style.badge}`}
											>
												{statusJobs.length}
											</span>
										</div>

										<div className="space-y-2">
											{statusJobs.length === 0 && (
												<div className="flex min-h-[88px] items-center justify-center rounded-lg border border-dashed border-slate-300/80 bg-white/50 text-xs font-medium text-slate-400 dark:border-slate-600/80 dark:bg-slate-900/30 dark:text-slate-500">
													No jobs
												</div>
											)}

											{statusJobs.map((job, index) => (
												<Draggable
													key={job.id}
													draggableId={String(job.id)}
													index={index}
												>
													{(dragProvided, dragSnapshot) => (
														(() => {
															const SourceIcon = getSourceIcon(job.applied_via)
															return (
														<article
															ref={dragProvided.innerRef}
															{...dragProvided.draggableProps}
															{...dragProvided.dragHandleProps}
															className={`rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition-all duration-200 dark:border-slate-700 dark:bg-slate-900 ${dragSnapshot.isDragging ? 'rotate-[0.4deg] scale-[1.01] shadow-md' : 'hover:-translate-y-0.5 hover:shadow-md'}`}
														>
															<div className="flex items-start justify-between gap-2">
																<p className="text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100">
																	{job.company}
																</p>
																<span
																	className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none ${statusTagClasses[job.status] ?? statusTagClasses.Applied}`}
																>
																	{job.status ?? 'Applied'}
																</span>
															</div>
															<p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
																{job.role}
															</p>
															{job.applied_via && (
																<p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-600 ring-1 ring-inset ring-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
																	<SourceIcon className="h-4 w-4" aria-hidden="true" />
																	<span>{job.applied_via}</span>
																</p>
															)}
														</article>
															)
														})()
													)}
												</Draggable>
											))}
										</div>

										{provided.placeholder}
									</div>
								)}
							</Droppable>
						)
					})}
				</div>
			</DragDropContext>
		</section>
	)
}

export default KanbanBoard
