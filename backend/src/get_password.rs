use crate::establish_connection;
use crate::schema::password_entries::dsl::password_entries;
use crate::{PasswordEntry, PasswordResponse};
use actix_web::{web, HttpResponse, Responder};
use diesel::SelectableHelper;
use diesel::associations::HasTable;

pub async fn get_passwords(query: web::Path<String>) -> impl Responder {
    println!("{}", query);
    let query_str = if query.as_str() == "~" {
        String::from("")
    } else {
        query.into_inner()
    };
    let conn = &mut establish_connection();
    let result = password_entries::table
        .filter(password_entries::platform.ilike(format!("%{}%", query_str)))
        .limit(5)
        .select(PasswordEntry::as_select())
        .load(conn)
        .expect("Issue loading");
    HttpResponse::Ok().json(PasswordResponse { entries: result })
}
