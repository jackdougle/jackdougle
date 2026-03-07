import AnimWrapper from "../../Transition";
import PageLayout from "../../components/PageLayout";
import content from "../../content/doings/nucleaze_intro.md?raw";

function NucleazeIntro() {
    return (
        <AnimWrapper>
            <PageLayout
                imageClass="dark:invert"
                content={content}
            />
        </AnimWrapper>
    );
}

export default NucleazeIntro;
