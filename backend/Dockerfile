FROM rust:latest as builder
WORKDIR /usr/local/src
COPY . .
RUN cargo install diesel_cli --no-default-features --features postgres
RUN cargo build --release
RUN rm -rf target/release/*.*
RUN find target/release -mindepth 1 -maxdepth 1 -type d -print0 | xargs -0 rm -rf 
RUN mv target/release/* ./app
CMD bash -c "diesel setup && diesel migration run && ./app"
