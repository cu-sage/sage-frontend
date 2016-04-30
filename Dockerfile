FROM golang
ADD bin/server /
COPY *html /go/
COPY *js /go/
CMD ["/server"]
