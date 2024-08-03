pub mod database;
pub mod del_password;
pub mod models;
pub mod schema;
pub mod update_password;
use crate::del_password::del_password;
use crate::update_password::update_password;
use actix_cors::Cors;
use actix_web::{web, App, HttpResponse, HttpServer, Responder, Result};
use database::*;
use diesel::{insert_into, PgTextExpressionMethods, QueryDsl, RunQueryDsl, SelectableHelper};
use models::PasswordEntry;
use schema::password_entries;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Serialize)]
struct MyResponse {
    message: String,
}
#[derive(Serialize, Deserialize, Clone)]
struct PasswordReq {
    platform: String,
    user: String,
    password: String,
    extra_info: Option<HashMap<String, String>>,
}
fn enter_password_into_persistent_storage(data: PasswordReq) -> Result<(), diesel::result::Error> {
    let mut conn = establish_connection();
    insert_into(password_entries::table)
        .values(&models::NewPasswordEntry {
            platform: &data.platform,
            user: &data.user,
            password: &data.password,
            extra_info: data
                .extra_info
                .as_ref()
                .map(|e| serde_json::to_string(e).expect("Should serialize"))
                .as_ref(),
        })
        .execute(&mut conn)?;
    Ok(())
}
async fn add_password(req: web::Json<PasswordReq>) -> impl Responder {
    let password_req = req.into_inner();
    let response: MyResponse = match enter_password_into_persistent_storage(password_req.clone()) {
        Ok(_) => MyResponse {
            message: format!(
                "Passed {0}: {1}",
                password_req.platform, password_req.password
            ),
        },
        Err(_) => MyResponse {
            message: format!(
                "Failed {0}: {1}",
                password_req.platform, password_req.password
            ),
        },
    };
    HttpResponse::Ok().json(response)
}
#[derive(Serialize, Deserialize, Clone)]
struct GetPassReq {
    query: String,
}
#[derive(Serialize)]
struct PasswordResponse {
    entries: Vec<PasswordEntry>,
}
async fn get_password(query: web::Path<String>) -> impl Responder {
    println!("{}", query);
    let query_str = if query.as_str() == "~" { String::from("") } else { query.into_inner() };
    let conn = &mut establish_connection();
    let result = password_entries::table
        .filter(password_entries::platform.ilike(format!("%{}%", query_str)))
        .limit(5)
        .select(PasswordEntry::as_select())
        .load(conn)
        .expect("Issue loading");
    HttpResponse::Ok().json(PasswordResponse { entries: result })
}

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
            .route("/get_password/{query}", web::get().to(get_password))
            .route("/update_password/{id}", web::put().to(update_password))
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
