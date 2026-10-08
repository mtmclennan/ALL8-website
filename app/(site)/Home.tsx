import refinement from "./_components/VisualRefinement.module.css";
import HeroSection from "./_components/home/HeroSection";
import ProofStrip from "./_components/home/ProofStrip";
import ServicesPreview from "./_components/home/ServicesPreview";
import PlansPreview from "./_components/home/PlansPreview";
import SystemRail from "./_components/home/SystemRail";
import CaseStudy from "./_components/home/CaseStudy";
import ProcessSteps from "./_components/home/ProcessSteps";
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
      <ServicesPreview />
      <PlansPreview />
      <SystemRail data={homeData.system} />
      <CaseStudy data={homeData.caseStudy} />
      <HomeResources />
      <WhyAll8 data={homeData.why} founder={homeData.founder} />
      <ProcessSteps data={homeData.process} />
      <FAQBlock
        className={refinement.faq}
        faqs={homeData.faqs}
        id="faq"
        subtitle="Common questions"
        title="What Owners Ask Before Getting Started"
        tone="alt"
      />
      <FinalCta data={homeData.finalCta} />
    </div>
  );
};

export default HomePage;
