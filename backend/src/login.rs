use crate::database::establish_connection;
use crate::schema::users;
use crate::{models::*, schema::users::username};
use actix_web::{web, HttpResponse, Responder};
use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
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
        Err(_) => return HttpResponse::NotFound().body("Username not found"),
    };
    let user: User = match users.len() {
        0 => unreachable!(),
        1 => users.first().unwrap().clone(),
        _ => return HttpResponse::InternalServerError() .body("This username has more than one entry, it is broken")
    };
    let password_hash = match users.first() {
        Some(user) => PasswordHash::new(&user.password_hash).expect("Password hashing failed"),
        None => unreachable!("No user not possible at this stage"),
    };
    match Argon2::default()
        .verify_password(&user_login.password.into_bytes(), &password_hash)
        .is_ok()
    {
        true => HttpResponse::Ok().json(SuccessfulLogin {message: "Logged in succesfully".to_string(), id: user.id}),
        false => HttpResponse::Unauthorized().body("Incorrect Password")
    }
}
