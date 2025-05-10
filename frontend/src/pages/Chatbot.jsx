export default function Chatbot() {
  return (
    <div className="container">
      <h1>Chatbot</h1>
      <p>This is the Chatbot page.</p>
      <p>Here you can interact with the chatbot.</p>
      <p>Type your message below:</p>
      <input type="text" placeholder="Type your message here..." />
      <button className="btn btn-primary">Send</button>
    </div>
  );
}
