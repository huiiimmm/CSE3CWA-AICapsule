import { useState, useEffect, useCallback } from 'react'
import './App.css'

function Dashboard() {
  const [capsuleArray, setCapsuleArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const loadCapsules = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);

    const fetchCapsuleData = async () => {
      try {
	const response = await fetch("/api/capsules", {
	  credentials: "include"
	});
	if (!response.ok) throw new Error("Failed to load capsules");
	  
	const capsuleData = await response.json();
	const capsules = Array.isArray(capsuleData) ? capsuleData : [];
	setCapsuleArray(capsules);
	setValidationMessage("");
	setLastUpdated(new Date());
      } catch (error) {
	console.error("Failed to load capsules:", error);
	setCapsuleArray([]);
	setValidationMessage("Unable to load capsules. Please refresh and try again.");
      } finally {
	setIsLoading(galse);
	setIsRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    loadCapsules();
  }, [loadCapsules]);

  return (
    <>
      <div>
        <h1>User Capsules</h1>
      </div>

      {isLoading ? (
        <p>Loading capsules...</p>
      ) : (
        <div>
          {validationMessage && <p>{validationMessage}</p>}

          {capsuleArray.length === 0 && !validationMessage && (
            <p>No capsules yet.</p>
          )}

          {capsuleArray.map((capsule) => (
            <div key={capsule.id}>
              <h3>{capsule.prompt_title}</h3>
              <p>Project: {capsule.project_name}</p>
              <p>Version: {capsule.prompt_version}</p>
              <p>Prompt: {capsule.prompt_text}</p>
              <p>Response summary: {capsule.response_summary}</p>
              <p>Category: {capsule.category}</p>
              <p>Usefulness: {capsule.usefulness}</p>
              <p>Reviewed: {capsule.reviewed ? "Yes" : "No"}</p>
              <p>Improved: {capsule.improved ? "Yes" : "No"}</p>
              {capsule.screenshot_url && (
                <p>
                  Screenshot: <a href={capsule.screenshot_url}>{capsule.screenshot_url}</a>
                </p>
              )}
              <p>Notes: {capsule.notes}</p>
              <p>Created: {capsule.created_at}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Dashboard;
