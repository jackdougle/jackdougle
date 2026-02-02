import AnimWrapper from "../Transition";
import { Link } from "react-router-dom";
import FloatingOrbs from "../components/FloatingOrbs"; // Import the new component

function Home() {
    return (
        <AnimWrapper>
            <FloatingOrbs />
            <div className="font-sans flex flex-col justify-center text-[21px] px-8 mr-6 relative z-10">
                <div className="flex flex-col m-4 font-light">
                    <p className="text-2xl font-bold font-mono mb-2">Who?</p>
                    <p>Hi! I'm an aspiring biosecurity researcher, iGEMer, and world-helper. I grew up in Tucson, Arizona, where I'm also an undergraduate.</p>
                    <p className="mt-2">Aside from that, I love open-world games, vegan food, anime, and all things biosecurity and biotech.</p>
                </div>
                <div className="flex flex-col m-4 font-light">
                    <p className="text-2xl font-bold font-mono mb-2">What?</p>
                    <p>As part of the ERA AI Biosecurity Fellowhsip, I'm currently researching Anthrax and Salmonella in Cambridge, UK. Back home in AZ, I design molecular TB tests at Strive Bioscience, a Gates Foundation-backed startup.</p>
                    <p className="mt-2">I also recently completed development of <Link to="https://github.com/jackdougle/nucleaze" className="font-mono font-bold text-[21px] text-sky-500 hover:text-sky-400 transition duration-300"> Nucleaze</Link>, a sequence decontamination program now streamlining the Nucleic Acid Observatory's biosurvaillance program. Finally, I'm leading <Link to="https://uaigem.org/" className="font-mono font-semibold text-[21px] text-sky-500 hover:text-sky-400 transition duration-300"> UA iGEM</Link>, a new synbio team focused on organoid research.</p>
                </div>
                <div className="flex flex-col m-4 font-light">
                    <p className="text-2xl font-bold font-mono mb-2">Why?</p>
                    <p>Humans (and most animals, likely) can experience things. You can experience things. You know what different stimuli feel like. We can safely assume that other humans (and conscious agents more broadly) have analoguous reponses to similar stimuli. Because of this, other conscious agents will suffer in ways you would suffer when exposed to negative stimuli.</p>
                    <p>Now, I ask you to take a leap of faith, to start caring about the experience of another like it's your own. We are born into situations outside of our control. These situations determine who we're close to, and give us easy candidates for people to love (i.e. the family and friends present in your geographic area).</p>
                    <p className="mt-2"></p>
                </div>
            </div>
        </AnimWrapper>
    )
}

export default Home;