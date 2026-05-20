import AnimWrapper from "../Transition";
import PageLayout from "../components/PageLayout";
import { manga } from "../constants/publicAssets.js";
import content from "../content/tips.md?raw";

function Thoughts() {
    return (
        <AnimWrapper>
            <PageLayout
                rightImage={manga.haise}
                imageClass="dark:invert"
                content={content}
            />
        </AnimWrapper>
    );
}

export default Thoughts;
