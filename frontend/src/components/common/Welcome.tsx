function Welcome() {
  return (
    <div className="flex flex-col items-center justify-center py-8 bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="text-center max-w-2xl px-6 py-5.5 bg-white rounded-xl bg-gradient-to-br from-indigo-50 to-blue-100">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 mb-4">
          Welcome to Cartify.com
        </h1>
        <h2 className="text-lg md:text-xl text-gray-600 mb-2">
          Discover amazing products at unbeatable prices
        </h2>
      </div>
    </div>
  );
}

export default Welcome;