
const GleanSuccessMetricsSection = () => {
  return (
    <section className="py-20 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Proven Enterprise Results</h2>
          <p className="text-lg text-gray-500 mb-2">Delivered by Authorized Partners</p>
          <p className="text-xl text-gray-600">Companies using Glean see immediate productivity gains</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-blue-600 mb-2">75%</div>
            <p className="text-gray-700 font-medium">Less time searching for information</p>
          </div>

          <div className="text-center">
            <div className="text-5xl font-bold text-blue-600 mb-2">3x</div>
            <p className="text-gray-700 font-medium">Faster knowledge discovery</p>
          </div>

          <div className="text-center">
            <div className="text-5xl font-bold text-blue-600 mb-2">90%</div>
            <p className="text-gray-700 font-medium">User adoption rate</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GleanSuccessMetricsSection;
