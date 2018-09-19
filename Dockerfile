FROM debian:9

RUN set -x \
	&& apt-get update \
	&& apt-get install -y festival \
    && rm -rvf /var/lib/apt/lists/*
