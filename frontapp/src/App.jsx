import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSubmit = async () => {
    try {
      const parsedInput = JSON.parse(jsonInput);
      if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
        toast.error("Invalid JSON format");
        return;
      }

      const res = await fetch("https://bajaj-pro.onrender.com/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedInput),
      });

      const data = await res.json();
      setResponse(data);
      toast.success("Data processed successfully!");
    } catch (error) {
      toast.error("Invalid JSON or API error");
    }
  };

  const renderResponse = () => {
    if (!response) return null;

    let displayedData = {};
    if (selectedOptions.includes("alphabets")) {
      displayedData.alphabets = response.alphabets;
    }
    if (selectedOptions.includes("numbers")) {
      displayedData.numbers = response.numbers;
    }
    if (selectedOptions.includes("highestAlphabet")) {
      displayedData.highestAlphabet = response.highestAlphabet;
    }

    return (
      <pre style={styles.responseBox}>
        {JSON.stringify(displayedData, null, 2)}
      </pre>
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Sachin Kumar Sah (22BCS11063)</h1>

      <textarea
        rows="5"
        cols="50"
        placeholder='Enter JSON (e.g., { "data": ["A","C","z"] })'
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        style={styles.textarea}
      />

      <button onClick={handleSubmit} style={styles.button}>
        Submit
      </button>

      {response && (
        <>
          <h3 style={styles.label}>Select Data to Display:</h3>
          <select
            multiple
            onChange={(e) =>
              setSelectedOptions(
                [...e.target.selectedOptions].map((opt) => opt.value)
              )
            }
            style={styles.select}
          >
            <option value="alphabets">Alphabets</option>
            <option value="numbers">Numbers</option>
            <option value="highestAlphabet">Highest Alphabet</option>
          </select>

          <h3 style={styles.label}>Response:</h3>
          {renderResponse()}
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f8f9fa",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    color: "#333",
    marginBottom: "20px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    marginBottom: "15px",
    resize: "none",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    color: "#fff",
    backgroundColor: "#007bff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "0.3s",
    marginBottom: "20px",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  label: {
    fontSize: "16px",
    marginTop: "10px",
    fontWeight: "bold",
  },
  select: {
    width: "100%",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "20px",
    cursor: "pointer",
  },
  responseBox: {
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    textAlign: "left",
    fontSize: "14px",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
  },
};
