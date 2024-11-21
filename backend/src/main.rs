pub mod add_password;
pub mod database;
pub mod del_password;
pub mod get_password;
pub mod login;
pub mod models;
pub mod new_user;
pub mod schema;
pub mod update_password;
pub mod jwt;
pub mod auth_middleware;
pub mod base_url;
use crate::add_password::add_password;
use crate::del_password::del_password;
use crate::get_password::get_passwords;
use crate::login::login;
use crate::new_user::new_user;
use crate::base_url::base_url;
use crate::update_password::update_password;
use crate::auth_middleware::AuthMiddleware;
use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use actix_web::middleware::Logger;


#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Hello from the server");

    // Initialize the logger (optional but helpful)
    env_logger::init();

    HttpServer::new(|| {
        App::new()
            .wrap(Logger::default()) // Add logger middleware
            .wrap(
                Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header(),
            )
            .service(
                web::scope("/api")
                    // Public routes
                    .route("/", web::get().to(base_url))
                    .route("/new_user", web::post().to(new_user))
                    .route("/login", web::post().to(login))
                    // Protected routes with AuthMiddleware applied directly
                    .route(
                        "/add_password",
                        web::post()
                            .to(add_password)
                            .wrap(AuthMiddleware), // Apply middleware here
                    )
                    .route(
                        "/del_password",
                        web::delete()
                            .to(del_password)
                            .wrap(AuthMiddleware), // Apply middleware here
                    )
                    .route(
                        "/get_password",
                        web::get()
                            .to(get_passwords)
                            .wrap(AuthMiddleware), // Apply middleware here
                    )
                    .route(
                        "/update_password/{id}",
                        web::put()
                            .to(update_password)
                            .wrap(AuthMiddleware), // Apply middleware here
                    ),
            )
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
