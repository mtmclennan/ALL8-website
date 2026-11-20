import refinement from "./_components/VisualRefinement.module.css";
import HeroSection from "./_components/home/HeroSection";
import ProofStrip from "./_components/home/ProofStrip";
import LeakSection from "./_components/home/LeakSection";
import ServicesPreview from "./_components/home/ServicesPreview";
import PlansPreview from "./_components/home/PlansPreview";
import CaseStudy from "./_components/home/CaseStudy";
import WhyAll8 from "./_components/home/WhyAll8";
import FAQBlock from "./_components/FAQBlock";
import FinalCta from "./_components/home/FinalCta";
import HomeResources from "./_components/home/HomeResources";

import { homeData } from "@/data/home";

const HomePage = () => {
  return (
    <div className={refinement.surface}>
      <HeroSection data={homeData.hero} />
      <ProofStrip data={homeData.proofStrip} />
      <CaseStudy data={homeData.caseStudy} />
      <LeakSection data={homeData.leak} />
      <ServicesPreview />
      <WhyAll8 data={homeData.why} founder={homeData.founder} />
      <PlansPreview />
      <HomeResources />
      <FAQBlock
        className={refinement.faq}
        faqs={homeData.faqs}
        id="faq"
        subtitle="Common questions"
        title="What Contractors Ask Before Getting Started"
        tone="base"
      />
      <FinalCta data={homeData.finalCta} />
    </div>
  );
};

export default HomePage;
