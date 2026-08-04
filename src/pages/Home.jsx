import AnimWrapper from "../Transition";
import PageLayout from "../components/PageLayout";
import { manga } from "../constants/publicAssets.js";
import content from "../content/home.md?raw";

function Home() {
    return (
        <AnimWrapper>
            <PageLayout
                leftImage={manga.luffy}
                imageClass="dark:invert"
                content={content}
            />
        </AnimWrapper>
    );
}

export default Home;
