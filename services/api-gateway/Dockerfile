# Use the official NGINX image
FROM docker.io/library/nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]