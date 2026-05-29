FROM node:26-slim AS builder

WORKDIR /build/

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

# Multi Stage

FROM nginx:alpine AS runner

COPY --from=builder /build/dist /app

COPY conf/nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]