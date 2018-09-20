# docker with synthts_et installed
# https://github.com/ikiissel/synthts_et
# https://www.eki.ee/heli/index.php?option=com_content&view=article&id=6&Itemid=465#LINUX

FROM debian:9

RUN apt-get update
RUN apt-get install -y build-essential git autoconf

ARG SYNTHTS_ET_URL=https://github.com/ikiissel/synthts_et.git
ARG SYNTHTS_ET_COMMIT=master

RUN git clone $SYNTHTS_ET_URL -b $SYNTHTS_ET_COMMIT /usr/src/synthts_et
WORKDIR /usr/src/synthts_et/synthts_et

RUN autoreconf -fiv
RUN ./configure
RUN make install
