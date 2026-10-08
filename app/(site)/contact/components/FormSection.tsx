import InlineLeadForm from "./InlineLeadForm";

export default function FormSection() {
  return (
    <section
      className="scroll-mt-[68px] bg-content3 pb-16 pt-8 sm:pt-12"
      id="form"
    >
      <div className="mx-auto max-w-[1160px] px-6 sm:px-10">
        <InlineLeadForm />
      </div>
    </section>
  );
}
