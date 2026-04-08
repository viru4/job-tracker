import { supabase } from './supabase'

const assertNoError = (error) => {
	if (error) {
		throw new Error(error.message)
	}
}

export async function fetchJobs() {
	const { data, error } = await supabase
		.from('jobs')
		.select('*')
		.order('created_at', { ascending: false })

	assertNoError(error)
	return data
}

export async function addJob(job) {
	const payload = {
		company: job.company,
		role: job.role,
		link: job.link,
		status: job.status,
		applied_via: job.applied_via,
		applied_date: job.applied_date,
		notes: job.notes,
	}

	const { data, error } = await supabase
		.from('jobs')
		.insert([payload])
		.select()
		.single()

	assertNoError(error)
	return data
}

export async function deleteJob(id) {
	const { error } = await supabase.from('jobs').delete().eq('id', id)
	assertNoError(error)
}

export async function updateJobStatus(id, status) {
	const { data, error } = await supabase
		.from('jobs')
		.update({ status })
		.eq('id', id)
		.select()
		.single()

	assertNoError(error)
	return data
}
