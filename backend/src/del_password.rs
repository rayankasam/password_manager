use crate::models::DeletePasswordEntry;
use crate::MyResponse;
use crate::{database::establish_connection, schema::password_entries::dsl::*};
use actix_web::{web, HttpResponse, Responder};
use diesel::{delete, prelude::*, ExpressionMethods};
pub async fn del_password(res: web::Json<DeletePasswordEntry>) -> impl Responder {
    let del_id = res.into_inner().id;
    let conn = &mut establish_connection();
    HttpResponse::Ok().json(MyResponse {
        message: match delete(password_entries).filter(id.eq(del_id)).execute(conn) {
            Ok(0) => "No entries with that id".to_string(),
            Ok(1) => "Deleted!".to_string(),
            Ok(_) => unreachable!("Should never delete more than 1 row"),
            Err(_) => "Failed".to_string(),
        },
    })
}
