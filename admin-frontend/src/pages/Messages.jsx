import { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import TableCard from "../components/TableCard";
import { getMessages, deleteMessage } from "../api/contact";
import "./Orders.css"

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(null);

  // 🔄 Load Messages
  const loadMessages = async () => {
    try {
      setLoading(true);
      const res = await getMessages();
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  // ❌ Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // 🔍 Filter
  const filteredMessages = messages.filter((m) =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageLayout title="Messages">

      <TableCard
        title="Contact Messages"
        right={
          <input
            className="input"
            placeholder="Search by name/email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 250 }}
          />
        }
      >

        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="empty-row">
                  Loading...
                </td>
              </tr>
            ) : filteredMessages.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-row">
                  No messages found
                </td>
              </tr>
            ) : (
              filteredMessages.map((msg) => (
                <tr key={msg._id}>
                  <td>{msg.name}</td>

                  <td>
                    {msg.email}
                  </td>

                  <td>{msg.subject}</td>

                  <td>
                    {msg.message.length > 40
                      ? msg.message.slice(0, 40) + "..."
                      : msg.message}
                  </td>

                 <td>
  <button
    className="view-btn"
    onClick={() => setSelectedMsg(msg)}
  >
    View
  </button>

  <button
    className="delete-btn"
    onClick={() => handleDelete(msg._id)}
  >
    Delete
  </button>
</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

      </TableCard>
    </PageLayout>
  );
};

export default Messages;