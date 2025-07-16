use crate::database::establish_connection;
use crate::jwt::Claims;
use crate::models::{ExtraInfo, MyResponse, PasswordEntry, PasswordResEntry};
use crate::schema::password_entries;
use actix_web::{web, HttpMessage, HttpRequest, HttpResponse, Responder};
use diesel::prelude::*;
use diesel::result::Error;
use diesel::{BelongingToDsl, ExpressionMethods, QueryDsl, RunQueryDsl};
use serde::Deserialize;
use std::collections::HashMap;

#[derive(Debug, Deserialize, Clone)]
pub struct QueryParams {
    query: Option<String>,
    page: Option<i64>,
    page_size: Option<i64>,
}
pub async fn get_passwords(
    req: HttpRequest,
    query_params: web::Query<QueryParams>,
) -> impl Responder {
    let claims: Claims = match req.extensions().get::<Claims>().cloned() {
        Some(claims) => claims,
        _ => {
            return HttpResponse::BadGateway().json(MyResponse {
                message: "No Claims found".to_string(),
            })
        }
    };

    let uid = claims.id;
    let query_str = query_params
        .clone()
        .into_inner()
        .query
        .unwrap_or("".to_string());
    let page = query_params.page.unwrap_or(1);
    let page_size = query_params.page_size.unwrap_or(10);
    let offset = (page - 1) * page_size;

    let conn = &mut establish_connection();

    // Get total count for pagination
    let total_count: i64 = match password_entries::table
        .filter(password_entries::user_id.eq(uid))
        .filter(password_entries::platform.ilike(format!("%{query_str}%")))
        .count()
        .get_result(conn)
    {
        Ok(count) => count,
        Err(_) => {
            return HttpResponse::InternalServerError().json(MyResponse {
                message: "Error counting passwords".to_string(),
            })
        }
    };

    let entries_result: Result<Vec<PasswordEntry>, Error> = conn.build_transaction().run(|conn| {
        password_entries::table
            .filter(password_entries::user_id.eq(uid))
            .filter(password_entries::platform.ilike(format!("%{query_str}%")))
            .offset(offset)
            .limit(page_size)
            .select(PasswordEntry::as_select())
            .load::<PasswordEntry>(conn)
    });

    match entries_result {
        Ok(password_entries) => {
            let mut new_pass_entries: Vec<PasswordResEntry> = password_entries
                .into_iter()
                .map(|entry| {
                    let extra_info_entry: Option<HashMap<String, String>> = get_extra_info(&entry);
                    PasswordResEntry {
                        id: entry.id,
                        platform: entry.platform.clone(),
                        user: entry.user.clone(),
                        password: entry.password.clone(),
                        extra_info: extra_info_entry,
                    }
                })
                .collect();

            new_pass_entries
                .sort_by(|a, b| a.platform.to_lowercase().cmp(&b.platform.to_lowercase()));

            HttpResponse::Ok().json(serde_json::json!({
                "items": new_pass_entries,
                "total": total_count,
                "page": page,
                "page_size": page_size
            }))
        }
        Err(_) => HttpResponse::InternalServerError().json(MyResponse {
            message: "Error loading passwords".to_string(),
        }),
    }
}
fn get_extra_info(password_entry: &PasswordEntry) -> Option<HashMap<String, String>> {
    let conn = &mut establish_connection();
    let extra_infos: Vec<ExtraInfo> = ExtraInfo::belonging_to(password_entry)
        .load(conn)
        .expect("Issue getting Extra Info");
    if extra_infos.is_empty() {
        return None;
    }
    let mut extra_infos_map = HashMap::new();
    for extra_info in extra_infos {
        extra_infos_map.insert(extra_info.type_, extra_info.info);
    }
    Some(extra_infos_map)
}
