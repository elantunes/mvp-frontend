FROM nginx:alpine

WORKDIR /site

COPY . ./static
COPY ./nginx/my.conf /etc/nginx/conf.d/mysite.conf
RUN rm /etc/nginx/conf.d/default.conf
RUN rm -r ./static/nginx/