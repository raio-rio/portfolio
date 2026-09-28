# Repository guidance

## Container workflow

- Use Node.js 22 through `Dockerfile` for project commands.
- Build image: `docker build -t rio-portfolio .`
- Run development server: `docker run --rm -p 4321:4321 rio-portfolio`
- Run checks: `docker run --rm rio-portfolio npm run check`
- Run production build: `docker run --rm rio-portfolio npm run build`
- Docker is not installed on every workstation. When unavailable, report limitation rather than installing host packages.
