<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Teslo API

## Install app

1. Clone repository

```bash
git clone link
```

2. Move to the main folder

```bash
cd teslo_shop_api
```

3. Install node dependencies

```bash
npm install
```

4. Rename `.env.template` to `.env`
5. Configure `.env` file

## Teslo Database (Recommend)

1. Install docker
2. Configure `.env` file
3. Run

```bash
docker compose up -d
```

## Preload data test (Optional)

1. Run app and database
2. Execute
   > **⚠️ IMPORTANT:** You need a login active with the role **Super admin**.

```bash
curl --location 'BASE_URL/api/seed'
```

## Documentation (Optional)

1. Run app and database
2. Enter to path `BASE_URL/api` or `BASE_URL/swagger/json`(Format JSON)
