import AnimWrapper from "../Transition";
import PageLayout from "../components/PageLayout";
import content from "../content/home.md?raw";

function Home() {
    return (
        <AnimWrapper>
            <PageLayout
                leftImage="/manga/luffy.jpg"
                imageClass="dark:invert"
                content={content}
            />
        </AnimWrapper>
    );
}

export default Home;
