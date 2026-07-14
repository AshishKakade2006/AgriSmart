import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { detectDisease } from "../services/diseaseService";
import toast from "react-hot-toast";

const DiseaseDetection = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!image) {
      toast.error("Please select an image");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", image);

      const res = await detectDisease(formData);

      setResult(res.data.result);

      toast.success("Analysis Complete");

    }  catch (err) {
  console.log("Backend Error:", err.response?.data);
  toast.error(err.response?.data?.message || "Analysis Failed");
}
    finally {

      setLoading(false);

    }
  };

  return (
    <DashboardLayout>

      <h1 className="text-4xl font-bold mb-8">
        🌿 AI Disease Detection
      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-8">

        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
        />

        {preview && (

          <img
            src={preview}
            alt="preview"
            className="w-80 rounded-xl mt-6"
          />

        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700"
        >
          {loading ? "Analyzing..." : "Analyze Plant"}
        </button>

      </div>

      {result && (

        <div className="bg-white rounded-2xl shadow-lg mt-8 p-8">

          <h2 className="text-3xl font-bold text-emerald-700 mb-6">
            Analysis Result
          </h2>

          <p>
            <strong>Disease:</strong> {result.disease}
          </p>

          <p>
            <strong>Confidence:</strong> {result.confidence}
          </p>

          <p>
            <strong>Severity:</strong> {result.severity}
          </p>

          <p className="mt-4">
            {result.description}
          </p>

          <h3 className="font-bold mt-6">
            Treatment
          </h3>

          <ul className="list-disc ml-6">

            {result.treatment.map((item, index) => (

              <li key={index}>
                {item}
              </li>

            ))}

          </ul>

          <h3 className="font-bold mt-6">
            Prevention
          </h3>

          <ul className="list-disc ml-6">

            {result.prevention.map((item, index) => (

              <li key={index}>
                {item}
              </li>

            ))}

          </ul>

        </div>

      )}

    </DashboardLayout>
  );
};

export default DiseaseDetection;