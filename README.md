# EKI TTS

This project contains docker related files to setup EKI tts in our infrastructure.

## Building synthts image

As synthts build takes time and not neccessary to build each time, it's build
separately and node runtime docker image copies binaries and data from synthts
image.

```
docker build -f Dockerfile.debian -t synthts
```

Later on, copy the needed data to node image:

```dockerfile
COPY --from=synthts /app /app
COPY --from=synthts /usr/bin/synthts_et /usr/bin
```

## Testing synthts

```
docker build -t app .
docker run --rm -v $(pwd)/spool:/spool \
    app \
    synthts_et -lex dct/et.dct -lexd dct/et3.dct -m htsvoices/eki_et_tnu.htsvoice -r 1.1 \
    -f /spool/in.txt -o /spool/out_tnu.wav
```
