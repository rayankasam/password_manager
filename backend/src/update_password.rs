use crate::models::{UpdatePasswordEntry, PasswordEntry};
use crate::{database::establish_connection, schema::password_entries::dsl::*};
use actix_web::{web, HttpRequest, HttpResponse, Responder, HttpMessage};
use diesel::{QueryDsl, RunQueryDsl};
use crate::jwt::Claims;
use crate::models::MyResponse;

pub async fn update_password(
    req: HttpRequest,
    message_id: web::Path<i32>,
    update_entry: web::Json<UpdatePasswordEntry>,
) -> impl Responder {
    let claims: Claims = match req.extensions().get::<Claims>().cloned() { 
        Some(claims) => claims,
        _ => return HttpResponse::BadGateway().json(MyResponse {message: "No Claims found".to_string()})
    };
    let update_message_id = message_id.into_inner();
    let uid = claims.id;
    let conn = &mut establish_connection();
    // Make sure that this message belongs to the user the req came from
    let entry: PasswordEntry = match password_entries.find(update_message_id).first(conn){
                Ok(entry) => entry,
                Err(e) => return HttpResponse::NotFound().json(MyResponse {message: format!("This message isn't in the db, {}", e)})
            };
    if entry.user_id != uid {
        return HttpResponse::Forbidden().json(MyResponse {message: "That Message doesn't belong to the user from which it came".to_string()})
    }
    let res = diesel::update(password_entries.find(update_message_id))
        .set(&*update_entry)
        .execute(conn);
    match res {
        Ok(_) => HttpResponse::Ok().json("Entry Updated"),
        Err(_) => HttpResponse::InternalServerError().json("Issue updating entry"),
    }
}
