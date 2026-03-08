# 1. Base Image: Lightweight Go environment
FROM golang:1.21-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy our Go code into the container
COPY . .

# 4. Compile the Go code into a binary file named "waf_engine"
RUN go build -o waf_engine ./cmd/waf/main.go

# 5. Expose the port the WAF runs on
EXPOSE 8080

# 6. Run the compiled binary
CMD ["./waf_engine"]