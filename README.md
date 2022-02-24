# Maratona Discover - RocketSeat

[Visit live app](https://devfinance-mu.vercel.app/)

This is a project using TypeScript, Remix, Tailwind, Prisma and PlanetScale used for learning.

The project's idea came from RocketSeat, a Brazilian platform teaching about development, the layout is exactly what they have. Other than changing the stack from vanilla HTML, CSS and JavaScript I also added a login/register flow since I would deploy the project.

## Development

Commands are straight from Remix:

### Running locally

```sh
npm run dev
```

### Database

You'll want to have a `.env` file with `DATABASE_URL` set to a local MySQL instance running, I've used PlanetScale for that so I run:

```sh
pscale connect DATABASE_NAME BRANCH --port 3309
```
