use crate::database::establish_connection;
use crate::models::*;
use actix_web::{web, Responder, HttpResponse};
use crate::schema::{extra_info, password_entries};
use diesel::result::Error;
use diesel::RunQueryDsl;

pub async fn add_password(req: web::Json<PasswordReq>) -> impl Responder {
    let password_req = req.into_inner();
    let response: MyResponse = match enter_password_into_persistent_storage(password_req.clone()) {
        Ok(_) => MyResponse {
            message: format!(
                "Passed {0}: {1}",
                password_req.platform, password_req.password
            ),
        },
        Err(_) => MyResponse {
            message: format!(
                "Failed {0}: {1}",
                password_req.platform, password_req.password
            ),
        },
    };
    HttpResponse::Ok().json(response)
}
fn enter_password_into_persistent_storage(
    data: PasswordReq,
) -> Result<(), diesel::result::Error> {
    let mut conn = establish_connection();

    conn.build_transaction()
        .read_write()
        .run::<_, Error, _>(|conn| {
            let new_password_entry = NewPasswordEntry {
                user_id: data.user_id.clone(),
                platform: data.platform.clone(),
                user: data.user.clone(),
                password: data.password.clone(),
            };

            let inserted_id: i32 = diesel::insert_into(password_entries::table)
                .values(&new_password_entry)
                .returning(password_entries::id)
                .get_result(conn)?;

            if let Some(extra_info_map) = data.extra_info {
                let new_extra_infos: Vec<NewExtraInfo> = extra_info_map
                    .into_iter()
                    .map(|(type_, info)| NewExtraInfo {
                        password_entry_id: inserted_id,
                        type_,
                        info,
                    })
                    .collect();

                diesel::insert_into(extra_info::table)
                    .values(&new_extra_infos)
                    .execute(conn)?;
            }

            Ok(())
        })
}
