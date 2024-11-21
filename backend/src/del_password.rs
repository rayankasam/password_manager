use crate::models::DeletePasswordEntry;
use crate::models::MyResponse;
use crate::models::PasswordEntry;
use crate::{database::establish_connection, schema::password_entries::dsl::*};
use crate::jwt::Claims;
use actix_web::HttpRequest;
use actix_web::{web, HttpResponse, Responder, HttpMessage};
use diesel::{delete, prelude::*, ExpressionMethods};
pub async fn del_password(
    req: HttpRequest,
    res: web::Json<DeletePasswordEntry>) -> impl Responder {
    let claims: Claims = match req.extensions().get::<Claims>().cloned() { 
        Some(claims) => claims,
        _ => return HttpResponse::BadGateway().json(MyResponse {message: "No Claims found".to_string()})
    };
    let uid = claims.id;
    let del_id = res.into_inner().id;
    let conn = &mut establish_connection();
    // Make sure that this message belongs to the user the req came from
    let entry: PasswordEntry = match password_entries.find(del_id).first(conn){
                Ok(entry) => entry,
                Err(e) => return HttpResponse::NotFound().json(MyResponse {message: format!("This message isn't in the db, {}", e)})
            };
    if entry.user_id != uid {
        return HttpResponse::Forbidden().json(MyResponse {message: "That Message doesn't belong to the user from which it came".to_string()})
    }

    HttpResponse::Ok().json(MyResponse {
        message: match delete(password_entries).filter(id.eq(del_id)).execute(conn) {
            Ok(0) => "No entries with that id".to_string(),
            Ok(1) => "Deleted!".to_string(),
            Ok(_) => unreachable!("Should never delete more than 1 row"),
            Err(e) => format!("Failed with error {}", e),
        },
    })
}
