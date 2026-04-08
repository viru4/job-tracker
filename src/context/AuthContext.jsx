import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { AuthContext } from './authContext.js'

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const getSessionUser = async () => {
			setLoading(true)

			try {
				const { data, error } = await supabase.auth.getSession()

				if (error) {
					throw new Error(error.message)
				}

				setUser(data.session?.user ?? null)
			} catch {
				setUser(null)
			} finally {
				setLoading(false)
			}
		}

		getSessionUser()

		// Listen for auth state changes (sign in/out)
		const { data: authListener } = supabase.auth.onAuthStateChange(
			(event, session) => {
				setUser(session?.user ?? null)
			},
		)

		return () => {
			authListener?.subscription?.unsubscribe()
		}
	}, [])

	return (
		<AuthContext.Provider value={{ user, setUser, loading }}>
			{children}
		</AuthContext.Provider>
	)
}
