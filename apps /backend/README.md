# ONDC NP Mock Server
This server is supposed to mock network participants and provide sample logs for better integration and onboarding to the network. 

## How it works:
 - If a B2B Buyer app NP is using this server, then an example of usage could be to mock a B2B seller app NP (BPP). Requests to `/api/b2b/bpp/*` would simulate requests that can be sent to B2B BPP. The response would have two properties `sync` and `async`. The `sync` property would be the response received immediately from BPP to signify the acknowledgement while the `async` property would denote the `on_<action>` response.

## Current Mock Status:
1. B2B BPP - **Done**
2. B2B BAP - **Done**

## Steps to Run:
There are 2 ways to run the project. You may either run it without docker or with docker. By default, Postgres DB will be ran in docker. But you can have your own Postgres instance running. To run the project without docker, follow these steps:
1. Clone the Repo, move into the project root and run `npm i`.
2. Copy the `copy.env` and name the copy `.env`. Fill the required values
4. If you wish to run Postgres in a docker instance then run `docker compose up db`. Otherwise, fill in the DB URI env var accordingly (Refer **[Postgres](#postgres)** section below).
3. To run the mock server in dev mode, run `npm run dev`.

If you wish to use Docker to run the mock server, then follow just step 2 of the above and then just run `docker compose up`. 
> Note: If running the server first time using Docker, a build step is needed. In that case, run `docker compose up --build` instead of `docker compose up`.

## ENV variables
The Environment Variables will help run the server in Sandbox mode and/or Rate Limiting Mode. The variables with their significance are listed below:
| **ENV Variable** | **Function** |
| - | - |
| PORT | Port to run the server on. |
| RATE_LIMIT_MODE | If present then Server limits the request rate from _mocker_ in a 24 hour period. |
| RATE_LIMIT_24HR | The number of request permitted per mocker. Required if RATE_LIMIT_MODE is enabled. |
| PRIVATE_KEY | The Private key the mock server uses for signing auth header on response |
| UNIQUE_KEY | Unique Key for the mock server. Used in Signature |
| SUBSCRIBER_ID | Subscriber ID for the mock server. Used in Signature |
| DATABASE_URL | Postgres Database URL. (Refer [Postgres](#postgres) section)|

## Postgres
The Mock Server uses Postgres instance for maintaining a list of NPs. This is also used for rate limiting purposes. The devs can either run Postgres in a Docker container option as provided or use their own.

> By default, the Postgres user, password and db are specified as `postgres`, `123` and `mock`. While this works when testing the mock server in localhost, please make sure to not use these if hosting.

Running `docker compose up db` will start the Postgres instance in a Docker container. The Connection string by default is `postgresql://postgres:123@localhost:5434/mock?schema=public`. Do not use this in production use cases.
