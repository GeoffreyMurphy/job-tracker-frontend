import { useEffect, useState, type FormEvent } from "react";
import "./App.css";

type JobStatus = "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED" | "ACCEPTED";
type FilterStatus = "ALL" | JobStatus;

type Job = {
  id: number;
  company: string;
  title: string;
  status: JobStatus;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
};

type NewJobForm = {
  company: string;
  title: string;
  status: JobStatus;
  notes: string;
};

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newJob, setNewJob] = useState<NewJobForm>({
    company: "",
    title: "",
    status: "APPLIED",
    notes: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");

  const filteredJobs = filterStatus === "ALL" ? jobs : jobs.filter((job) => job.status === filterStatus);

  async function loadJobs() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("http://localhost:8080/jobs");
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      const data: Job[] = await res.json();
      setJobs(data);
    } catch (err: any) {
      setError(err.message ?? "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); 
    setSubmitError(null);
    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:8080/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newJob)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed with status ${res.status}`);
      }

      await loadJobs();

      setNewJob({
        company: "",
        title: "",
        status: "APPLIED",
        notes: ""
      });
    } catch (err: any) {
      setSubmitError(err.message ?? "Failed to create job");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm("Delete this job?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:8080/jobs/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Delete failed with status ${res.status}`);
      }

      await loadJobs();
    } catch (err: any) {
      alert(err.message ?? "Failed to delete job");
    }
  }

  async function handleStatusChange(id: number, newStatus: JobStatus) {
    try {
      const job = jobs.find((j) => j.id === id);
      if (!job) return;

      const res = await fetch(`http://localhost:8080/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          company: job.company,
          title: job.title,
          status: newStatus,
          notes: job.notes
        })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Update failed with status ${res.status}`);
      }

      await loadJobs();
    } catch (err: any) {
      alert(err.message ?? "Failed to update job");
    }
  }


  return (
    <div className="app">
      <header className="app-header">
        <h1>Job Tracker</h1>
        <p>Dashboard for your job applications</p>
      </header>

      <main className="layout">
        {/* Left side: form */}
        <section className="new-job-section">
          <h2>Add New Job</h2>
          <form onSubmit={handleSubmit} className="job-form">
            <label className="form-field">
              <span>Company</span>
              <input
                type="text"
                value={newJob.company}
                onChange={(e) =>
                  setNewJob({ ...newJob, company: e.target.value })
                }
                placeholder="e.g. Atlassian"
                required
              />
            </label>

            <label className="form-field">
              <span>Title</span>
              <input
                type="text"
                value={newJob.title}
                onChange={(e) =>
                  setNewJob({ ...newJob, title: e.target.value })
                }
                placeholder="e.g. Junior Backend Developer"
                required
              />
            </label>

            <label className="form-field">
              <span>Status</span>
              <select
                value={newJob.status}
                onChange={(e) =>
                  setNewJob({ ...newJob, status: e.target.value as JobStatus })
                }
              >
                <option value="APPLIED">APPLIED</option>
                <option value="INTERVIEW">INTERVIEW</option>
                <option value="OFFER">OFFER</option>
                <option value="REJECTED">REJECTED</option>
                <option value="ACCEPTED">ACCEPTED</option>
              </select>
            </label>

            <label className="form-field">
              <span>Notes</span>
              <textarea
                value={newJob.notes}
                onChange={(e) =>
                  setNewJob({ ...newJob, notes: e.target.value })
                }
                placeholder="Optional notes about this application"
                rows={3}
              />
            </label>

            {submitError && (
              <p className="error-text">Error: {submitError}</p>
            )}

            <button className="primary-button" type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Add Job"}
            </button>
          </form>
        </section>

        {/* Right side: job list */}
        <section className="job-list-section">
          <h2>Your Jobs</h2>

          <div className="filter-bar">
            <span>Filter:</span>
            <button
              type="button"
              className={
                filterStatus === "ALL"
                  ? "filter-chip filter-chip-active"
                  : "filter-chip"
              }
              onClick={() => setFilterStatus("ALL")}
            >
              All ({jobs.length})
            </button>

            <button
              type="button"
              className={
                filterStatus === "APPLIED"
                  ? "filter-chip filter-chip-active"
                  : "filter-chip"
              }
              onClick={() => setFilterStatus("APPLIED")}
            >
              Applied
            </button>

            <button
              type="button"
              className={
                filterStatus === "INTERVIEW"
                  ? "filter-chip filter-chip-active"
                  : "filter-chip"
              }
              onClick={() => setFilterStatus("INTERVIEW")}
            >
              Interview
            </button>

            <button
              type="button"
              className={
                filterStatus === "OFFER"
                  ? "filter-chip filter-chip-active"
                  : "filter-chip"
              }
              onClick={() => setFilterStatus("OFFER")}
            >
              Offer
            </button>

            <button
              type="button"
              className={
                filterStatus === "REJECTED"
                  ? "filter-chip filter-chip-active"
                  : "filter-chip"
              }
              onClick={() => setFilterStatus("REJECTED")}
            >
              Rejected
            </button>

            <button
              type="button"
              className={
                filterStatus === "ACCEPTED"
                  ? "filter-chip filter-chip-active"
                  : "filter-chip"
              }
              onClick={() => setFilterStatus("ACCEPTED")}
            >
              Accepted
            </button>
          </div>

          {loading && <p>Loading jobs...</p>}
          {error && <p className="error-text">Error: {error}</p>}

          {!loading && !error && filteredJobs.length === 0 && (
            <p>No jobs match this filter. Try a different status or add a job.</p>
          )}

          {!loading && !error && filteredJobs.length > 0 && (
            <div className="job-list">
              {filteredJobs.map((job) => (
                <article key={job.id} className="job-card">
                  <div className="job-card-header">
                    <div>
                      <h3>{job.title}</h3>
                      <p className="job-company">{job.company}</p>
                    </div>
                    <div className="job-card-actions">
                      <span
                        className={`status-badge status-${job.status.toLowerCase()}`}
                      >
                        {job.status}
                      </span>

                      <select
                        className="status-select"
                        value={job.status}
                        onChange={(e) =>
                          handleStatusChange(job.id, e.target.value as JobStatus)
                        }
                      >
                        <option value="APPLIED">APPLIED</option>
                        <option value="INTERVIEW">INTERVIEW</option>
                        <option value="OFFER">OFFER</option>
                        <option value="REJECTED">REJECTED</option>
                        <option value="ACCEPTED">ACCEPTED</option>
                      </select>

                      <button
                        className="secondary-button"
                        type="button"
                        onClick={() => handleDelete(job.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {job.notes && <p className="job-notes">{job.notes}</p>}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
