
import ResponsiveWrapper from "../helpers/ResponsiveWrapper.astro"


export default {
    component: ResponsiveWrapper,
}

export const Regular = {
    args: {
        componentRoute: "/ui/ButtonGroup"
    }
}

export const SmallScreen = {
    args: {
        simulateWidth: "400px",
        componentRoute: "/ui/ButtonGroup"
    }
}