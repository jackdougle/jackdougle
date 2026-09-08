import AnimWrapper from "../Transition";
import BlogList from "../components/BlogList.jsx";
import PageLayout from "../components/PageLayout";
import { manga } from "../constants/publicAssets.js";
import content from "../content/home.md?raw";

function Home() {
    return (
        <AnimWrapper slide={false}>
            <PageLayout
                leftImage={manga.luffy}
                imageClass="dark:invert"
                content={content}
                sectionHeadings
            />
            <BlogList />
        </AnimWrapper>
    );
}

export default Home;
