use crate::models::MyResponse;
use actix_web::{HttpResponse, Responder};
pub async fn base_url() -> impl Responder {
    HttpResponse::Ok().json(MyResponse {
        message: "Hello from the server".to_string(),
    })
}
