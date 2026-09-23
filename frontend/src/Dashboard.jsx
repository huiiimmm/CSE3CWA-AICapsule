import { useState, useEffect, useCallback } from 'react'
import './Dashboard.css'

function Dashboard() {
  const [capsuleArray, setCapsuleArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingCapsule, setEditingCapsule] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const [showCapsuleCreateForm, setShowCapsuleCreateForm] = useState(false);

  const [capsuleCreateForm, setCapsuleCreateForm] = useState({
    project_name: "",
    prompt_title: "",
    prompt_version: "",
    prompt_text: "",
    response_summary: "",
    category: "",
    usefulness: "",
    reviewed: 0,
    improved: 0,
    screenshot_url: "",
    notes: ""
  });

  const [formError, setFormError] = useState("");

  const validateCapsuleForm = (form) => {
    if (!form.project_name) return "Please enter project name";
    if (!form.prompt_title) return "Please enter prompt title";
    if (!form.prompt_version) return "Please enter prompt version";
    if (!form.prompt_text) return "Please enter prompt text";
    if (!form.response_summary) return "Please enter response summary";
    if (!form.category) return "Please enter category";
    if (!form.usefulness) return "Please enter usefulness";

    return "";
  };

  const loadCapsules = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);

    try {
      const response = await fetch("/api/capsules", { credentials: "include" });
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
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCapsules();
  }, [loadCapsules]);

  const resetForm = () => {
    setCapsuleCreateForm({
      project_name: "",
      prompt_title: "",
      prompt_version: "",
      prompt_text: "",
      response_summary: "",
      category: "",
      usefulness: "",
      reviewed: 0,
      improved: 0,
      screenshot_url: "",
      notes: "",
    });
    setEditingCapsule(null);
    setFormError("");
  };

  const handleFormChange = (field, value) => {
    setCapsuleCreateForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateCapsule = async (e) => {
    e.preventDefault();

    const error = validateCapsuleForm(capsuleCreateForm);
    if (error) {
      setFormError(error);
      return;
    }

    setIsSaving(true);
    try {
      const isEditing = editingCapsule !== null;
      const url = isEditing ? `/api/capsules/${editingCapsule.id}` : "/api/capsules";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(capsuleCreateForm),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Failed to save capsule");
      }

      resetForm();
      setShowCapsuleCreateForm(false);
      await loadCapsules();
    } catch (error) {
      console.error("Error saving capsule:", error);
      setFormError(error.message || "Failed to save capsule");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (capsule) => {
    const confirmed = window.confirm(`Remove the capsule for "${capsule.prompt_title}"?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/capsules/${capsule.id}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (!res.ok) throw new Error(`HTTP error, status: ${res.status}`);
      await loadCapsules();
    } catch (error) {
      console.error("Failed to delete capsule:", error);
    }
  };

  const handleEdit = (capsule) => {
    setEditingCapsule(capsule);
    setFormError("");
    setCapsuleCreateForm({
      project_name: capsule.project_name,
      prompt_title: capsule.prompt_title,
      prompt_version: capsule.prompt_version,
      prompt_text: capsule.prompt_text,
      response_summary: capsule.response_summary,
      category: capsule.category,
      usefulness: capsule.usefulness,
      reviewed: capsule.reviewed,
      improved: capsule.improved,
      screenshot_url: capsule.screenshot_url,
      notes: capsule.notes,
    });
    setShowCapsuleCreateForm(true);
  };

  const handleCancelForm = () => {
    resetForm();
    setShowCapsuleCreateForm(false);
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Your Capsules</h1>
        <div className="dashboard-actions">
          <button
            className="btn btn-secondary"
            onClick={() => loadCapsules(true)}
            disabled={isRefreshing}
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => { resetForm(); setShowCapsuleCreateForm(true); }}
          >
            New Capsule
          </button>
        </div>
      </div>

      {showCapsuleCreateForm && (
        <form className="capsule-form" onSubmit={handleCreateCapsule}>
          {formError && <p className="form-error">{formError}</p>}

          <div className="form-grid">
            <input
              className="form-input"
              placeholder="Project name"
              value={capsuleCreateForm.project_name}
              onChange={(e) => handleFormChange("project_name", e.target.value)}
            />
            <input
              className="form-input"
              placeholder="Prompt title"
              value={capsuleCreateForm.prompt_title}
              onChange={(e) => handleFormChange("prompt_title", e.target.value)}
            />
            <input
              className="form-input"
              placeholder="Prompt version"
              value={capsuleCreateForm.prompt_version}
              onChange={(e) => handleFormChange("prompt_version", e.target.value)}
            />
            <input
              className="form-input"
              placeholder="Category"
              value={capsuleCreateForm.category}
              onChange={(e) => handleFormChange("category", e.target.value)}
            />
            <input
              className="form-input"
              placeholder="Usefulness"
              value={capsuleCreateForm.usefulness}
              onChange={(e) => handleFormChange("usefulness", e.target.value)}
            />
            <input
              className="form-input"
              placeholder="Screenshot URL"
              value={capsuleCreateForm.screenshot_url}
              onChange={(e) => handleFormChange("screenshot_url", e.target.value)}
            />
          </div>

          <textarea
            className="form-textarea"
            placeholder="Prompt text"
            value={capsuleCreateForm.prompt_text}
            onChange={(e) => handleFormChange("prompt_text", e.target.value)}
          />
          <textarea
            className="form-textarea"
            placeholder="Response summary"
            value={capsuleCreateForm.response_summary}
            onChange={(e) => handleFormChange("response_summary", e.target.value)}
          />
          <textarea
            className="form-textarea"
            placeholder="Notes"
            value={capsuleCreateForm.notes}
            onChange={(e) => handleFormChange("notes", e.target.value)}
          />

          <div className="form-checkboxes">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={!!capsuleCreateForm.reviewed}
                onChange={(e) => handleFormChange("reviewed", e.target.checked ? 1 : 0)}
              />
              Reviewed
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={!!capsuleCreateForm.improved}
                onChange={(e) => handleFormChange("improved", e.target.checked ? 1 : 0)}
              />
              Improved
            </label>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : editingCapsule ? "Update Capsule" : "Create Capsule"}
            </button>
            <button className="btn btn-ghost" type="button" onClick={handleCancelForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <p className="status-text">Loading capsules...</p>
      ) : (
        <div className="capsule-list">
          {validationMessage && <p className="status-text error">{validationMessage}</p>}

          {capsuleArray.length === 0 && !validationMessage && (
            <p className="status-text">No capsules yet.</p>
          )}

          {capsuleArray.map((capsule) => (
            <div className="capsule-card" key={capsule.id}>
              <div className="capsule-card-header">
                <h3 className="capsule-title">{capsule.prompt_title}</h3>
                <span className="capsule-version">{capsule.prompt_version}</span>
              </div>

              <p className="capsule-meta">{capsule.project_name} · {capsule.category}</p>

              <p className="capsule-text">{capsule.prompt_text}</p>
              <p className="capsule-text secondary">{capsule.response_summary}</p>

              <div className="capsule-badges">
                <span className="badge">{capsule.usefulness}</span>
                <span className={`badge ${capsule.reviewed ? "badge-yes" : "badge-no"}`}>
                  Reviewed: {capsule.reviewed ? "Yes" : "No"}
                </span>
                <span className={`badge ${capsule.improved ? "badge-yes" : "badge-no"}`}>
                  Improved: {capsule.improved ? "Yes" : "No"}
                </span>
              </div>

              {capsule.screenshot_url && (
                <p className="capsule-link">
                  <a href={capsule.screenshot_url} target="_blank" rel="noreferrer">
                    View screenshot
                  </a>
                </p>
              )}

              {capsule.notes && <p className="capsule-notes">{capsule.notes}</p>}

              <p className="capsule-date">Created {capsule.created_at}</p>

              <div className="capsule-card-actions">
                <button className="btn btn-secondary" onClick={() => handleEdit(capsule)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(capsule)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
