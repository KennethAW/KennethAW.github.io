/* Sits outside the flow, after the footer, like the chrome at the top of the
   page. Dropped once already when the page was split into components, and the
   text diff did not catch it because a button with only an aria-label and an
   icon contains no text to compare. */
export default function ToTop() {
  return (
    <button className="to-top" type="button" aria-label="Back to top">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
    </button>
  );
}
