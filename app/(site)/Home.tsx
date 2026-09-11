import refinement from "./_components/VisualRefinement.module.css";
import HeroSection from "./_components/home/HeroSection";
import ProofStrip from "./_components/home/ProofStrip";
import LeakSection from "./_components/home/LeakSection";
import SystemRail from "./_components/home/SystemRail";
import OutcomeServices from "./_components/home/OutcomeServices";
import CaseStudy from "./_components/home/CaseStudy";
import IntegrationsFlow from "./_components/home/IntegrationsFlow";
import ProcessSteps from "./_components/home/ProcessSteps";
import WhyAll8 from "./_components/home/WhyAll8";
import ProofCards from "./_components/home/ProofCards";
import FounderSection from "./_components/home/FounderSection";
import FAQBlock from "./_components/FAQBlock";
import FinalCta from "./_components/home/FinalCta";
import HomeResources from "./_components/home/HomeResources";

import { homeData } from "@/data/home";

const HomePage = () => {
  return (
    <div className={refinement.surface}>
      <HeroSection data={homeData.hero} />
      <ProofStrip data={homeData.proofStrip} />
      <LeakSection data={homeData.leak} />
      <SystemRail data={homeData.system} />
      <OutcomeServices data={homeData.outcomes} />
      <CaseStudy data={homeData.caseStudy} />
      <HomeResources />
      <IntegrationsFlow data={homeData.flow} />
      <ProcessSteps data={homeData.process} />
      <WhyAll8 data={homeData.why} />
      <ProofCards data={homeData.proofCards} />
      <FounderSection data={homeData.founder} />
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
