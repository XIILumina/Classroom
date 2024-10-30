import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Google Classroom Style Page" />
            <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
                {/* Header */}
                <header className="flex justify-between items-center p-6 bg-white dark:bg-gray-800 shadow-md">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                        My Classroom
                    </div>
                    
                </header>

                {/* Main Content */}
                <main className="flex-grow flex items-center justify-center">
                    <div className="max-w-4xl bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full mx-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                            Where teaching and learning come together
                        </h1>
                        <p className="text-gray-700 dark:text-gray-400 mb-6 text-center">
                            Google Classroom helps educators create engaging learning experiences they can personalize, 
                            manage, and measure. Part of Google Workspace for Education, it empowers educators to enhance their impact 
                            and prepare students for the future.
                        </p>

                        <div className="flex justify-center space-x-4 mb-6">


                            {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition duration-300"
                            >
                                Enter Home page
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition duration-300"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition duration-300"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                        </div>

                        {/* Video Embed */}
                        <div className="relative pt-[56.25%]">
                            <iframe
                                className="absolute top-0 left-0 w-full h-full rounded-lg"
                                src="https://www.youtube.com/embed/UEFgW--0094?rel=0"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Google Classroom Intro Video"
                            />
                        </div>




                        <p className="mt-6 text-gray-700 dark:text-gray-400 text-center">
                            Why you should choose Google Classroom: With educator feedback every step of the way, 
                            Classroom has evolved from a simple assignment distribution tool to a central destination 
                            that enables institutions to achieve real learning impact.
                        </p>
                    </div>
                </main>


            </div>
        </>
    );
}
