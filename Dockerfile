FROM node:26-slim AS builder

WORKDIR /build/

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

# Multi Stage

FROM nginx:alpine AS runner

RUN apk add --no-cache openssl

COPY --from=builder /build/build/client /app

COPY conf/nginx.conf.template /etc/nginx/templates/default.conf.template

COPY --chmod=755 conf/generate-cert.sh /docker-entrypoint.d/05-generate-cert.sh

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]