# My personal website

This is a basic Astro site used to showcase me, seeing as how I'm basically a commodity now.

## Usage

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Development

Astrobook is the workbench that lets me build components fast. Create a story in the stories folder and hook it up. If we need to do responsive design, the ResponsiveWrapper helper can be used to size the viewport to exactly what it would be on a device. 

Running `npm run dev` will build all stories and they are hosted at `http://localhost:4321/astrobook`.

Decorator support is coming to Astrobook in a following PR.

## Deployment

The project is deployed using [Surge](https://surge.sh/). Make sure it's installed

`npm install --global surge`

Then deployment is as simple as running the Astro build command, then the Surge deploy command.

```sh
npm run build
surge ./dist eheaver.cloud
```
The site will then be live at the domain provided.