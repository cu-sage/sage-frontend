FROM golang
ADD bin/server /
COPY app /go/app
COPY blocks /go/blocks
COPY media /go/media
COPY msg /go/msg
COPY blockly_compressed.js /go
COPY javascript_compressed.js /go
COPY blocks_compressed.js /go
CMD ["/server"]
