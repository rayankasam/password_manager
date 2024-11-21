use crate::database::establish_connection;
use crate::models::{NewUser, NewUserReq, User};
use crate::schema::users;
use crate::models::MyResponse;
use actix_web::{web, HttpResponse, Responder};
use argon2::{
    password_hash::{PasswordHasher, SaltString},
    Argon2,
};
use diesel::{PgTextExpressionMethods, QueryDsl, RunQueryDsl, SelectableHelper};
use rand_core::OsRng;

pub async fn new_user(req: web::Json<NewUserReq>) -> impl Responder {
    let new_user: NewUserReq = req.into_inner();
    // Check to make sure that no one with the same username already exist
    let mut conn = establish_connection();
    match users::table
        .filter(users::username.ilike(new_user.username.clone()))
        .select(User::as_select())
        .load::<User>(&mut conn)
        .expect("Something went wrong querying for a user with this new name")
        .len()
    {
        0 => (),
        _ => {
            return HttpResponse::Conflict()
                .json(MyResponse{message: "A user by this name already exists, use anothe rname".to_string()})
        }
    }

    let argon2 = Argon2::default();
    let password_salt: SaltString = SaltString::generate(&mut OsRng);
    let password_hash = argon2
        .hash_password(new_user.password.as_bytes(), &password_salt)
        .expect("Hash failed")
        .to_string();
    let changed_rows = diesel::insert_into(users::table)
        .values(&NewUser {
            username: new_user.username,
            password_hash,
        })
        .execute(&mut conn);
    match changed_rows {
        Ok(0) => unreachable!("Should never change no rows when adding user"),
        Ok(1) => HttpResponse::Ok().json(MyResponse{message: "Added".to_string()}),
        Ok(_) => unreachable!("Should never change more than 1 row when adding user"),
        Err(_) => HttpResponse::InternalServerError().json(MyResponse {message: "Unable to add user, try again later".to_string()}),
    }
}
