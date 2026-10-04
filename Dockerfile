FROM node:22-alpine

ARG NPM_REGISTRY=https://registry.npmjs.org/
ARG NPM_STRICT_SSL=false

WORKDIR /app

ENV npm_config_audit=false \
    npm_config_fund=false \
    npm_config_update_notifier=false \
    npm_config_registry=${NPM_REGISTRY} \
    npm_config_strict_ssl=${NPM_STRICT_SSL}

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
