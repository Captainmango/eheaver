// @ts-check
import { defineConfig } from 'astro/config'
import astrobook from "astrobook"
import icon from "astro-icon"

function excludeUiPages() {
    return {
        name: "exclude-ui-pages",
        hooks: {
            // @ts-ignore
            "astro:build:setup": ({ pages, logger, vite }) => {
                if (process.env.NODE_ENV === "production") {
                    // @ts-ignore
                    for (const [pathname, pageData] of pages.entries()) {
                        if (pageData.component.toString().includes("/pages/ui/")) {
                            logger.info(`Excluding UI page: ${pageData.component}`)
                            pages.delete(pageData.key)
                        }
                    }
                }

                vite.plugins.push({
                    name: "virtual-ignore-ui-pages",
                    /**
                     * @param {string | string[]} id
                     */
                    load(id) {
                        if (id.includes("/pages/ui/")) {
                            return "export default {}"
                        }
                        return null
                    },
                    /**
                     * @param {string | string[]} source
                     */
                    resolveId(source) {
                        if (source.includes("/pages/ui/")) {
                            return source // Mark as resolved so `load` can intercept it
                        }
                        return null
                    },
                })
            },
        },
    }
}

// https://astro.build/config
export default defineConfig({
    integrations: [
        icon(),
        process.env.NODE_ENV === "production"
            ? []
            : astrobook({
                directory: "src/components/stories",
                subpath: "/astrobook",
                head: "./src/layouts/Head.astro"
            }),
        process.env.NODE_ENV === "production" 
            ? excludeUiPages()
            : []
    ]
})
