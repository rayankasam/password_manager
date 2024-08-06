use crate::database::establish_connection;
use crate::schema::users;
use crate::{models::*, schema::users::username};
use actix_web::{web, HttpResponse, Responder};
use diesel::{PgTextExpressionMethods, QueryDsl, RunQueryDsl, SelectableHelper};
pub async fn login(req: web::Json<LoginReq>) -> impl Responder {
    let user_login = req.into_inner();
    let mut conn = establish_connection();
    match users::table
        .filter(username.ilike(user_login.username))
        .select(User::as_select())
        .load::<User>(&mut conn)
    {
        Ok(users) => {
            if users.len() > 1 {return HttpResponse::InternalServerError().body("This username has more than one entry, it is broken")}
            let user = users.first();
            // This is the 'happy path' where the user is in the database and there is only one,
            // Still need to check if the password hash matches the password passed in the loginReq

        }
        Err(_) => {
            HttpResponse::NotFound().body("Username not found");
        }
    }
    HttpResponse::Ok().body("TODO")
}
