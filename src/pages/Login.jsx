import { useState } from 'react'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import { signIn, signUp } from '../lib/auth'
import { useAuth } from '../context/useAuth'

export default function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const [loading, setLoading] = useState(false)
	const [isSignUp, setIsSignUp] = useState(false)
	const { user, setUser } = useAuth()

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')
		setSuccess('')
		setLoading(true)

		try {
			if (isSignUp) {
				const result = await signUp(email, password)

				if (result.user) {
					if (result.session) {
						setUser(result.user)
					} else {
						setSuccess('Signup successful. Check your email to confirm your account before signing in.')
					}
				} else {
					setSuccess('Signup request sent. Check your email for confirmation instructions.')
				}
			} else {
				const result = await signIn(email, password)

				if (result.user) {
					setUser(result.user)
					// Redirect happens via App.jsx conditional render
				}
			}
		} catch (err) {
			setError(err.message || `An error occurred during ${isSignUp ? 'signup' : 'sign in'}`)
		} finally {
			setLoading(false)
		}
	}

	const toggleAuthMode = () => {
		setIsSignUp((prev) => !prev)
		setError('')
		setSuccess('')
	}

	if (user) {
		return null // App.jsx will handle redirect
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Card */}
				<div className="bg-white rounded-2xl shadow-xl p-8">
					{/* Header */}
					<div className="mb-8">
						<h1 className="text-3xl font-bold text-gray-900">
							{isSignUp ? 'Create Account' : 'Welcome Back'}
						</h1>
						<p className="text-gray-500 mt-2">
							{isSignUp ? 'Sign up to start tracking your job applications' : 'Sign in to your job tracker'}
						</p>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Error Banner */}
						{error && (
							<div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
								<AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
								<p className="text-sm text-red-600">{error}</p>
							</div>
						)}

						{success && (
							<div className="bg-green-50 border border-green-200 rounded-lg p-4">
								<p className="text-sm text-green-700">{success}</p>
							</div>
						)}

						{/* Email Field */}
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
								Email
							</label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
								<input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="you@example.com"
									required
									disabled={loading}
									className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition"
								/>
							</div>
						</div>

						{/* Password Field */}
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
								Password
							</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
								<input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="••••••••"
									required
									disabled={loading}
									className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition"
								/>
							</div>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={loading || !email || !password}
							className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition duration-200 flex items-center justify-center gap-2"
						>
							{loading ? (
								<>
									<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
									{isSignUp ? 'Signing up...' : 'Signing in...'}
								</>
							) : (
								isSignUp ? 'Sign Up' : 'Sign In'
							)}
						</button>
					</form>

					{/* Footer */}
					<p className="text-center text-sm text-gray-500 mt-6">
						{isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
						<button
							type="button"
							onClick={toggleAuthMode}
							disabled={loading}
							className="text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
						>
							{isSignUp ? 'Sign in' : 'Sign up'}
						</button>
					</p>
				</div>

				{/* Info Text */}
				<p className="text-center text-xs text-gray-500 mt-6">
					Protected by Supabase Authentication
				</p>
			</div>
		</div>
	)
}
