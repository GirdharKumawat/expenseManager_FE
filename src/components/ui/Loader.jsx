 

function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                        <div className="animate-fadeIn flex flex-col items-center space-y-4 rounded-xl bg-white p-6 shadow-md">
                            <svg
                                className="h-12 w-12 animate-spin text-green-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8H4z"></path>
                            </svg>
                            <p className="text-lg font-semibold text-green-700">Loading...</p>
                        </div>
                    </div>
  )
}

export default Loader;