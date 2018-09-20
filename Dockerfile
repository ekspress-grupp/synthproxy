# docker with synthts_et installed
# https://github.com/ikiissel/synthts_et
# https://www.eki.ee/heli/index.php?option=com_content&view=article&id=6&Itemid=465#LINUX

FROM debian:9

RUN apt-get update
RUN apt-get install -y build-essential git autoconf
RUN git clone https://github.com/ikiissel/synthts_et.git /usr/src/synthts_et

ARG SYNTHTS_ET_COMMIT=10a7776

WORKDIR /usr/src/synthts_et/synthts_et
RUN git checkout $SYNTHTS_ET_COMMIT

RUN autoreconf -fiv
RUN ./configure
RUN make install

FROM debian:9

COPY synthts_et /usr/bin
