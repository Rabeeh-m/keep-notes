
export default function About() {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col items-center pt-24 pb-16 px-6">
        
        <section className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
            About Keep Notes
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            A simple, powerful, and elegant note-taking app designed to keep your thoughts organized and accessible.
          </p>
        </section>
  
        
        <section className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          
          <div className="relative bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm font-semibold px-3 py-1 rounded-full">
              Organize
            </div>
            <h2 className="text-xl font-semibold mt-6 mb-3 text-center">Effortless Organization</h2>
            <p className="text-gray-600 text-center">
              Categorize your notes with ease and find them instantly with our intuitive search and tagging system.
            </p>
          </div>
          
          <div className="relative bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm font-semibold px-3 py-1 rounded-full">
              Sync
            </div>
            <h2 className="text-xl font-semibold mt-6 mb-3 text-center">Cross-Device Sync</h2>
            <p className="text-gray-600 text-center">
              Access your notes anywhere, anytime, with seamless synchronization across all your devices.
            </p>
          </div>
          
          <div className="relative bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 group">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm font-semibold px-3 py-1 rounded-full">
              Secure
            </div>
            <h2 className="text-xl font-semibold mt-6 mb-3 text-center">Secure & Private</h2>
            <p className="text-gray-600 text-center">
              Your notes are protected with top-notch security, ensuring your ideas stay yours alone.
            </p>
          </div>
        </section>
  
        
        <section className="max-w-5xl w-full mx-auto text-center mb-20 relative">
          <div className="relative inline-block">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 z-10 relative">Our Mission</h2>
            <div className="absolute bottom-2 left-0 right-0 h-2 bg-gray-200 rounded-full opacity-50"></div>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            At Keep Notes, we believe in simplifying the way you capture and manage your ideas. Whether you’re jotting down a quick thought, planning a project, or keeping a personal journal, our goal is to provide a distraction-free, reliable, and beautiful experience that empowers your creativity and productivity.
          </p>
        </section>
  
        
        <section className="text-center">
          <a
            href="/register"
            className="inline-block bg-black text-white py-4 px-10 rounded-full font-semibold text-lg
                       border-2 border-transparent hover:bg-white hover:text-black hover:border-black
                       transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Get Started
          </a>
        </section>
      </div>
    );
  }