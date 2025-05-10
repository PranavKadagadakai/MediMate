export default function Translate() {
  return (
    <div className="container">
      <h1>Translate</h1>
      <p>This is the Translate page.</p>
      <p>Here you can translate text between different languages.</p>
      <textarea
        rows="4"
        cols="50"
        placeholder="Type text to translate here..."
      ></textarea>
      <button className="btn btn-primary">Translate</button>
    </div>
  );
}
