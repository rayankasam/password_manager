pub mod database;
pub mod del_password;
pub mod add_password;
pub mod get_password;
pub mod models;
pub mod schema;
pub mod update_password;
use crate::add_password::add_password;
use crate::del_password::del_password;
use crate::get_password::get_passwords;
use crate::update_password::update_password;
use actix_cors::Cors;
use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use models::*;
use serde::{Deserialize, Serialize};

async fn base_url() -> impl Responder {
    HttpResponse::Ok().json(MyResponse {
        message: "Hello from the server".to_string(),
    })
}
#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Hello from the server");
    HttpServer::new(|| {
        App::new()
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header(),
            )
            .route("/", web::get().to(base_url))
            .route("/add_password", web::post().to(add_password))
            .route("/del_password", web::delete().to(del_password))
            .route("/get_password/{query}", web::get().to(get_passwords))
            .route("/update_password/{id}", web::put().to(update_password))
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
