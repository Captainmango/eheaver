
import ResponsiveWrapper from "../helpers/ResponsiveWrapper.astro"


export default {
    component: ResponsiveWrapper,
}

export const Regular = {
    args: {
        simulatedHeight: "600px",
        simulatedWidth: "1200px",
        componentRoute: "/ui/UIButtonGroup"
    }
}

export const SmallScreen = {
    args: {
        simulatedWidth: "400px",
        simulatedHeight: "800px",
        componentRoute: "/ui/UIButtonGroup"
    }
}