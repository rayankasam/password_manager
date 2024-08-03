use crate::models::UpdatePasswordEntry;
use crate::{database::establish_connection, schema::password_entries::dsl::*};
use actix_web::{web, HttpResponse, Responder};
use diesel::{QueryDsl, RunQueryDsl};

pub async fn update_password(
    entry_id: web::Path<i32>,
    update_entry: web::Json<UpdatePasswordEntry>,
) -> impl Responder {
    let conn = &mut establish_connection();
    let res = diesel::update(password_entries.find(entry_id.into_inner()))
        .set(&*update_entry)
        .execute(conn);
    match res {
        Ok(_) => HttpResponse::Ok().json("Entry Updated"),
        Err(_) => HttpResponse::InternalServerError().json("Issue updating entry"),
    }
}
