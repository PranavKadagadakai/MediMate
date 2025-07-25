import React, { useState, useEffect } from "react";
import api from "../api";
import { useProfile } from "../context/ProfileContext";
import LoadingIndicator from "../components/LoadingIndicator";

function Messenger() {
  const { profile, loading: profileLoading } = useProfile();
  const [contacts, setContacts] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      setLoading(true);
      const endpoint =
        profile.role === "doctor"
          ? "/api/messaging/chats/"
          : "/api/messaging/doctors/";
      api
        .get(endpoint)
        .then((res) => {
          if (profile.role === "doctor") {
            const chatContacts = res.data.map((chat) => {
              // Now that participants_profile is available from the API,
              // find the other participant's profile directly from it.
              const otherParticipantProfile = chat.participants_profile?.find(
                (p) => p.id !== profile.id
              );

              // Construct the contact object using the actual profile data
              return {
                id: otherParticipantProfile?.id, // Use the actual ID from the profile
                full_name: otherParticipantProfile?.full_name || null,
                username:
                  otherParticipantProfile?.username ||
                  `User ${otherParticipantProfile?.id || "Unknown"}`, // Fallback for safety
                chatId: chat.id,
              };
            });
            setContacts(chatContacts);
          } else {
            // For patients, the contacts are all doctors (assuming they have full_name/username and id)
            setContacts(res.data);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [profile]);

  const fetchMessages = async (chatId) => {
    try {
      const res = await api.get(`/api/messaging/chats/${chatId}/messages/`);
      setMessages(res.data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const selectContact = async (contact) => {
    if (profile.role === "patient") {
      try {
        const res = await api.post(
          `/api/messaging/chats/initiate/${contact.id}/`
        );
        setActiveChat({ ...contact, chatId: res.data.id });
        fetchMessages(res.data.id);
      } catch (error) {
        console.error("Failed to initiate chat", error);
      }
    } else {
      // Doctor
      setActiveChat(contact);
      fetchMessages(contact.chatId);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    try {
      await api.post(`/api/messaging/chats/${activeChat.chatId}/messages/`, {
        content: newMessage,
        chat: activeChat.chatId,
      });
      setNewMessage("");
      fetchMessages(activeChat.chatId); // Refresh messages
    } catch (error) {
      console.error("Failed to send message:", error);
      if (error.response && error.response.data) {
        console.error("Server Response Data:", error.response.data);
      }
    }
  };

  if (profileLoading) {
    return (
      <div className="text-center mt-5">
        <LoadingIndicator />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center mt-5">
        <p>User profile not available. Please log in or refresh.</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm" style={{ height: "75vh" }}>
            <div className="row g-0 h-100">
              <div
                className="col-md-4 border-end h-100"
                style={{ overflowY: "auto" }}
              >
                <div className="p-3 border-bottom">
                  <h4 className="h5">
                    {profile.role === "patient" ? "Doctors" : "Patient Chats"}
                  </h4>
                </div>
                {loading ? (
                  <LoadingIndicator />
                ) : (
                  <ul className="list-group list-group-flush">
                    {contacts.map((contact) => (
                      <li
                        key={contact.chatId || contact.id}
                        className={`list-group-item list-group-item-action ${
                          activeChat?.chatId === contact.chatId ? "active" : ""
                        }`}
                        onClick={() => selectContact(contact)}
                        style={{ cursor: "pointer" }}
                      >
                        {/* This will now use the actual full_name or username */}
                        {contact.full_name || contact.username}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="col-md-8 d-flex flex-column h-100">
                {activeChat ? (
                  <>
                    <div className="p-3 border-bottom">
                      <h4 className="h5 mb-0">
                        {activeChat.full_name || activeChat.username}
                      </h4>
                    </div>
                    <div
                      className="flex-grow-1 p-3"
                      style={{ overflowY: "auto" }}
                    >
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`d-flex mb-2 ${
                            msg.author_profile.email === profile.email
                              ? "justify-content-end"
                              : "justify-content-start"
                          }`}
                        >
                          <div
                            className={`p-2 rounded ${
                              msg.author_profile.email === profile.email
                                ? "bg-primary text-white"
                                : "bg-light"
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-top bg-light">
                      <form onSubmit={handleSendMessage}>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Type a message"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                          />
                          <button className="btn btn-primary" type="submit">
                            Send
                          </button>
                        </div>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100">
                    <p className="text-muted">
                      Select a contact to start messaging
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Messenger;
