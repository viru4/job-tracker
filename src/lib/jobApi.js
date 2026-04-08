import { supabase } from './supabase'

const assertNoError = (error) => {
	if (error) {
		throw new Error(error.message)
	}
}

const getAuthenticatedUser = async () => {
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser()

	assertNoError(userError)

	if (!user) {
		throw new Error('Your session has expired. Please sign in again.')
	}

	return user
}

export async function fetchJobs() {
	const user = await getAuthenticatedUser()

	const { data, error } = await supabase
		.from('jobs')
		.select('*')
		.eq('user_id', user.id)
		.order('created_at', { ascending: false })

	assertNoError(error)
	return data
}

export async function addJob(job) {
	const user = await getAuthenticatedUser()

	const payload = {
		user_id: user.id,
		company: job.company,
		role: job.role,
		link: job.link,
		status: job.status,
		applied_via: job.applied_via,
		applied_date: job.applied_date,
		notes: job.notes,
	}

	const { error } = await supabase.from('jobs').insert([payload])

	assertNoError(error)
	return true
}

export async function deleteJob(id) {
	const user = await getAuthenticatedUser()
	const { error } = await supabase
		.from('jobs')
		.delete()
		.eq('id', id)
		.eq('user_id', user.id)
	assertNoError(error)
}

export async function updateJobStatus(id, status) {
	const user = await getAuthenticatedUser()

	const { data, error } = await supabase
		.from('jobs')
		.update({ status })
		.eq('id', id)
		.eq('user_id', user.id)
		.select()
		.single()

	assertNoError(error)
	return data
}
