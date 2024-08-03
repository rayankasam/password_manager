use diesel::prelude::*;
use serde::{Deserialize, Serialize};

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
    pub extra_info: Option<&'a String>,
}
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct DeletePasswordEntry {
    pub id: i32
}
