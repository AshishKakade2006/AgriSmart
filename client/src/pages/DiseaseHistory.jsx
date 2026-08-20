import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { getDiseaseHistory } from "../services/diseaseService";
import toast from "react-hot-toast";

const DiseaseHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);

      const res = await getDiseaseHistory();

      setHistory(res.data.history || []);
    } catch (err) {
      console.log("History Error:", err.response?.data);

      toast.error(
        err.response?.data?.message || "Failed to load disease history"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <DashboardLayout>

      <h1 className="text-4xl font-bold mb-8">
        📋 Disease Detection History
      </h1>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <p className="text-gray-600">
            Loading history...
          </p>
        </div>
      ) : history.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <p className="text-gray-600 text-lg">
            No disease scans found.
          </p>

          <p className="text-gray-400 mt-2">
            Your previous disease detections will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">

          {history.map((scan) => (

            <div
              key={scan._id}
              className="bg-white rounded-2xl shadow-lg p-6"
            >

              <div className="flex justify-between items-start">

                <div>
                  <h2 className="text-2xl font-bold text-emerald-700">
                    {scan.disease}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Crop: {scan.crop}
                  </p>
                </div>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    scan.severity === "High"
                      ? "bg-red-100 text-red-700"
                      : scan.severity === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : scan.severity === "Low"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {scan.severity}
                </span>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">
                    Confidence
                  </p>

                  <p className="text-xl font-bold">
                    {scan.confidence}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-500 text-sm">
                    Date
                  </p>

                  <p className="text-xl font-bold">
                    {new Date(scan.createdAt).toLocaleDateString()}
                  </p>
                </div>

              </div>

              {scan.recommendation && (
                <div className="mt-6">

                  <h3 className="font-bold text-lg mb-2">
                    💊 Recommendation
                  </h3>

                  <p className="text-gray-600">
                    {scan.recommendation}
                  </p>

                </div>
              )}

            </div>

          ))}

        </div>
      )}

    </DashboardLayout>
  );
};

export default DiseaseHistory;