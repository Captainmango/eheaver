import ResponsiveWrapper from "../helpers/ResponsiveWrapper.astro";


export default {
    component: ResponsiveWrapper
}

export const LargeScreen = {
    args: {
        simulatedHeight: "800px",
        simulatedWidth: "1200px",
        componentRoute: "/ui/UIBlogpostCard"
    }
}

export const MobileScreen = {
    args: {
        simulatedHeight: "800px",
        simulatedWidth: "360px",
        componentRoute: "/ui/UIBlogpostCard"
    }
}