FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN mkdir -p /dist && cp -r index.html assets days grade2-math-enrichment-plan.html /dist/

FROM nginxinc/nginx-unprivileged:stable-alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /dist /usr/share/nginx/html
EXPOSE 8080
