use crate::database::establish_connection;
use crate::jwt::encode_jwt;
use crate::schema::users;
use crate::{models::*, schema::users::username};
use actix_web::{web, HttpResponse, Responder};
use argon2::{
    password_hash::{PasswordHash, PasswordVerifier},
    Argon2,
};
use diesel::{PgTextExpressionMethods, QueryDsl, RunQueryDsl, SelectableHelper};
pub async fn login(req: web::Json<LoginReq>) -> impl Responder {
    let user_login = req.into_inner();
    let mut conn = establish_connection();
    let users = match users::table
        .filter(username.ilike(user_login.username))
        .select(User::as_select())
        .load::<User>(&mut conn)
    {
        Ok(users) => users,
        Err(_) => {
            return HttpResponse::NotFound().json(MyResponse {
                message: "Username not found".to_string(),
            })
        }
    };
    let user: User = match users.len() {
        0 => {
            return HttpResponse::Unauthorized().json(MyResponse {
                message: "Incorrect Username".to_string(),
            })
        }
        1 => users.first().unwrap().clone(),
        _ => {
            return HttpResponse::InternalServerError().json(MyResponse {
                message: "This username has more than one entry, it is broken".to_string(),
            })
        }
    };
    let password_hash = PasswordHash::new(&user.password_hash).expect("Password hashing failed");
    let token = encode_jwt(user.id).unwrap();
    match Argon2::default()
        .verify_password(&user_login.password.into_bytes(), &password_hash)
        .is_ok()
    {
        true => HttpResponse::Ok().json(SuccessfulLogin {
            message: "Logged in succesfully".to_string(),
            token
        }),
        false => HttpResponse::Unauthorized().json(MyResponse {
            message: "Incorrect Password".to_string(),
        }),
    }
}
