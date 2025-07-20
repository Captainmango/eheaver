
import ResponsiveWrapper from "../helpers/ResponsiveWrapper.astro"


export default {
    component: ResponsiveWrapper,
}

export const Regular = {
    args: {
        componentRoute: "/ui/UIButtonGroup"
    }
}

export const SmallScreen = {
    args: {
        simulatedWidth: "400px",
        componentRoute: "/ui/UIButtonGroup"
    }
}