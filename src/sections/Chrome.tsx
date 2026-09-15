/* The fixed decorative layers and the skip link: everything that sits outside
   the document flow and belongs to no section. */
export default function Chrome() {
  return (
    <>
      <a className="skip-link" href="#main" data-no-smooth>Skip to content</a>
      <div className="progress" aria-hidden="true"></div>
      <div className="field" aria-hidden="true">
        <i className="f-sheen"></i>
        <i className="f-gold"></i>
        <i className="f-ember"></i>
        <i className="f-cool"></i>
      </div>
      <div className="grain" aria-hidden="true"></div>
    </>
  );
}
