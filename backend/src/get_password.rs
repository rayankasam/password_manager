use crate::database::establish_connection;
use crate::schema::password_entries;
use crate::models::{ExtraInfo, PasswordEntry, PasswordResEntry, MyResponse};
use crate::jwt::Claims;
use actix_web::{web, HttpRequest, HttpResponse, Responder, HttpMessage};
use diesel::result::Error;
use diesel::{BelongingToDsl, ExpressionMethods, QueryDsl, RunQueryDsl};
use serde::Deserialize;
use std::collections::HashMap;
use diesel::prelude::*;

#[derive(Debug, Deserialize)]
pub struct QueryParams {
    query: Option<String>,
}
pub async fn get_passwords(
    req: HttpRequest, 
    query_params: web::Query<QueryParams>
    ) -> impl Responder { 
    let claims: Claims = match req.extensions().get::<Claims>().cloned() { 
        Some(claims) => claims,
        _ => return HttpResponse::BadGateway().json(MyResponse {message: "No Claims found".to_string()})
    };
    let uid = claims.id;
    let query_str = match query_params.into_inner().query {
        Some(a) => a,
        _ => String::from(""),
    };
    let conn = &mut establish_connection();

    let entries_result: Result<Vec<PasswordEntry>, Error> = conn.build_transaction().run(|conn| {
        password_entries::table
            .filter(password_entries::user_id.eq(uid))
            .filter(password_entries::platform.ilike(format!("%{}%", query_str)))
            .limit(5)
            .select(PasswordEntry::as_select())
            .load::<PasswordEntry>(conn)
    });
    match entries_result {
        Ok(password_entries) => {
            let new_pass_entries: Vec<PasswordResEntry> = password_entries
                .into_iter()
                .map(|entry| {
                    let extra_info_entry: Option<HashMap<String, String>> = get_extra_info(&entry);
                    PasswordResEntry {
                        id: entry.id.clone(),
                        platform: entry.platform.clone(),
                        user: entry.user.clone(),
                        password: entry.password.clone(),
                        extra_info: extra_info_entry,
                    }
                })
                .collect();
            HttpResponse::Ok().json(new_pass_entries)
        }
        Err(_) => HttpResponse::InternalServerError().json(MyResponse {message: "Error loading passwords".to_string()}),
    }
}
fn get_extra_info(password_entry: &PasswordEntry) -> Option<HashMap<String, String>> {
    let conn = &mut establish_connection();
    let extra_infos: Vec<ExtraInfo> = ExtraInfo::belonging_to(password_entry)
        .load(conn)
        .expect("Issue getting Extra Info");
    if extra_infos.len() == 0 {
        return None;
    }
    let mut extra_infos_map = HashMap::new();
    for extra_info in extra_infos {
        extra_infos_map.insert(extra_info.type_, extra_info.info);
    }
    Some(extra_infos_map)
}
