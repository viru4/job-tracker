import { useAuth } from './context/useAuth'
import Login from './pages/Login'
import JobTracker from './components/JobTracker'

function App() {
	const { user, loading: authLoading } = useAuth()

	// Show loading screen while checking auth
	if (authLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
				<div className="flex flex-col items-center gap-3">
					<div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
					<p className="text-sm text-gray-600">Loading...</p>
				</div>
			</div>
		)
	}

	// Show login page if not authenticated, otherwise show job tracker
	return user ? <JobTracker /> : <Login />
}

export default App
