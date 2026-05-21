FROM node:26-slim AS builder

WORKDIR /build/

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

# Multi Stage

FROM nginx:alpine AS runner

COPY --from=builder /build/dist /app

COPY conf/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]