use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Queryable, Selectable, Serialize)]
#[diesel(table_name = crate::schema::password_entries)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct PasswordEntry {
    pub id: i32,
    pub platform: String,
    pub user: String,
    pub password: String,
    pub extra_info: Option<String>,
}
#[derive(Serialize, Deserialize, Clone, AsChangeset, Debug)]
#[diesel(table_name = crate::schema::password_entries)]
#[diesel(check_for_backend(diesel::pg::Pg))]
pub struct UpdatePasswordEntry {
    platform: Option<String>,
    user: Option<String>,
    password: Option<String>,
}
#[derive(Insertable)]
#[diesel(table_name = crate::schema::password_entries)]
pub struct NewPasswordEntry<'a> {
    pub platform: &'a String,
    pub user: &'a String,
    pub password: &'a String,
}
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct DeletePasswordEntry {
    pub id: i32
}
#[derive(Queryable, Insertable, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::extra_info)]
pub struct ExtraInfo {
    pub id: i32,
    pub password_entry_id: i32,
    pub type_: String,
    pub info: String,
}
#[derive(Insertable, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::extra_info)]
pub struct NewExtraInfo {
    pub password_entry_id: i32,
    pub type_: String,
    pub info: String,
}
#[derive(Serialize)]
pub struct MyResponse {
    pub message: String,
}
#[derive(Serialize, Deserialize, Clone)]
pub struct PasswordReq {
    pub platform: String,
    pub user: String,
    pub password: String,
    pub extra_info: Option<HashMap<String, String>>,
}
#[derive(Serialize, Deserialize, Clone)]
pub struct GetPassReq {
    pub query: String,
}
#[derive(Serialize)]
pub struct PasswordResponse {
    pub entries: Vec<PasswordEntry>,
}
