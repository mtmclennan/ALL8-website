/**
 * A successful form control for bots, excluded from rendering, focus and AT.
 * Keep the neutral name: contact-like names invite browser autofill heuristics.
 * Do not clear or disable this field; the server must receive filled traps.
 */
export default function HoneypotField() {
  return (
    <div hidden aria-hidden="true" style={{ display: "none" }}>
      <input
        aria-hidden="true"
        autoComplete="off"
        data-1p-ignore="true"
        data-lpignore="true"
        defaultValue=""
        name="hp"
        tabIndex={-1}
        type="text"
      />
    </div>
  );
}
