# docker with festival and et voices installed
# https://www.eki.ee/heli/index.php?option=com_content&view=article&id=6&Itemid=465#LINUX

FROM alpine

RUN apk add --no-cache curl
RUN curl -sSfLO https://www.eki.ee/heli/download/festvox_eki_et_riina_clunits.tar.gz
RUN tar xf festvox_eki_et_riina_clunits.tar.gz

FROM debian:9

RUN set -x \
	&& apt-get update \
	&& apt-get install -y festival \
    && rm -rvf /var/lib/apt/lists/*

COPY --from=0 /festival/lib/voices/* /usr/share/festival/voices/
