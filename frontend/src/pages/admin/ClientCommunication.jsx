import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBuilding, FaComments, FaExclamationTriangle, FaPaperPlane } from "react-icons/fa";
import "./ClientCommunication.css";

const emptyForm = {
  subject: "",
  body: "",
  recipientName: "",
  projectName: "",
};

function ClientCommunicationPage() {
  const navigate = useNavigate();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [replyInputs, setReplyInputs] = useState({});
  const [sending, setSending] = useState(false);
  const [replyingId, setReplyingId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchThreads = async () => {
    if (!token) return;

    try {
      const res = await axios.get("/api/messages", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredThreads = (res.data?.messages || []).filter((thread) => {
        const recipientName = (thread.recipientName || "").toLowerCase();
        const senderName = (thread.senderName || "").toLowerCase();
        const replyRoles = (thread.replies || []).map((reply) => (reply.senderRole || "").toLowerCase());
        const mentionsEngineer =
          recipientName.includes("engineer") ||
          recipientName.includes("david") ||
          senderName.includes("engineer") ||
          senderName.includes("david") ||
          replyRoles.includes("engineer");
        return !mentionsEngineer;
      });
      setThreads(filteredThreads);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    fetchThreads();
  }, [navigate, token]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.body.trim()) return;

    try {
      setSending(true);
      await axios.post(
        "/api/messages",
        {
          subject: form.subject.trim(),
          body: form.body.trim(),
          recipientName: form.recipientName.trim() || "Client",
          projectName: form.projectName.trim() || "Building Project",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm(emptyForm);
      await fetchThreads();
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const apiFallbackUrl = "http://127.0.0.1:5000";

  const safePost = async (url, data, config) => {
    try {
      return await axios.post(url, data, config);
    } catch (err) {
      if (err?.response?.status === 404 && typeof url === "string" && url.startsWith("/api")) {
        return await axios.post(`${apiFallbackUrl}${url}`, data, config);
      }
      throw err;
    }
  };

  const handleReply = async (e, threadId) => {
    e.preventDefault();
    const replyText = (replyInputs[threadId] || "").trim();
    if (!replyText) return;

    try {
      setReplyingId(threadId);
      await safePost(
        `/api/messages/${threadId}/reply`,
        { body: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReplyInputs((prev) => ({ ...prev, [threadId]: "" }));
      await fetchThreads();
    } catch (error) {
      console.error(error);
    } finally {
      setReplyingId(null);
    }
  };

  return (
    <div className="client-communication-page">
      <div className="client-communication-shell">
        <aside className="client-communication-sidebar">
          <div className="sidebar-brand">
            <FaComments />
            <div>
              <h2>Client Issues</h2>
              <p>Project communication hub</p>
            </div>
          </div>

          <div className="sidebar-card">
            <h3><FaBuilding /> Building conversations</h3>
            <p>Handle client updates, site concerns, and follow-up discussion around the building.</p>
          </div>

          <div className="sidebar-card">
            <h3><FaExclamationTriangle /> Quick guidance</h3>
            <p>Keep updates clear, attach the project context, and reply promptly to keep trust high.</p>
          </div>
        </aside>

        <main className="client-communication-main">
          <header className="client-communication-header">
            <div>
              <p className="eyebrow">Client communication</p>
              <h1>Talk with the client about issues or building progress</h1>
            </div>
          </header>

          <section className="client-communication-card">
            <div className="section-heading">
              <div>
                <h3>Start a new conversation</h3>
                <p>Send a clear message about a building issue, milestone, or progress update.</p>
              </div>
            </div>

            <form className="message-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Project or building name"
                value={form.projectName}
                onChange={(e) => setForm({ ...form, projectName: e.target.value })}
              />
              <input
                type="text"
                placeholder="Client name"
                value={form.recipientName}
                onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
              />
              <input
                type="text"
                placeholder="Subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
              />
              <textarea
                placeholder="Describe the issue, progress update, or question for the client..."
                rows="5"
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                required
              />
              <button type="submit" disabled={sending}>
                <FaPaperPlane /> {sending ? "Sending..." : "Send message"}
              </button>
            </form>
          </section>

          <section className="client-communication-card">
            <div className="section-heading">
              <div>
                <h3>Recent conversations</h3>
                <p>{threads.length} active thread(s)</p>
              </div>
            </div>

            {loading ? (
              <p className="empty-state">Loading conversations...</p>
            ) : threads.length === 0 ? (
              <div className="empty-state">No conversations yet. Start one above to talk with the client.</div>
            ) : (
              <div className="thread-list">
                {threads.map((thread) => (
                  <article key={thread._id} className="thread-card">
                    <div className="thread-top">
                      <div>
                        <p className="thread-badge">{thread.projectName || "Building Project"}</p>
                        <h4>{thread.subject}</h4>
                        <p className="thread-meta">From {thread.senderName || "Client"} to {thread.recipientName || "Team"}</p>
                      </div>
                      <span className={`thread-status ${thread.status?.toLowerCase() || "open"}`}>{thread.status || "Open"}</span>
                    </div>

                    <p className="thread-body">{thread.body}</p>

                    {thread.replies?.length > 0 && (
                      <div className="reply-stack">
                        {thread.replies.map((reply, index) => (
                          <div key={`${thread._id}-${index}`} className="reply-item">
                            <strong>{reply.senderName}</strong>
                            <span>{reply.senderRole || "team"}</span>
                            <p>{reply.body}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <form className="reply-form" onSubmit={(e) => handleReply(e, thread._id)}>
                      <input
                        type="text"
                        placeholder="Reply to this client conversation..."
                        value={replyInputs[thread._id] || ""}
                        onChange={(e) => setReplyInputs({ ...replyInputs, [thread._id]: e.target.value })}
                      />
                      <button type="submit" disabled={replyingId === thread._id}>
                        {replyingId === thread._id ? "Replying..." : "Reply"}
                      </button>
                    </form>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default ClientCommunicationPage;
