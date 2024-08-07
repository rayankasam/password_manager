// @generated automatically by Diesel CLI.

diesel::table! {
    extra_info (id) {
        id -> Int4,
        password_entry_id -> Int4,
        #[sql_name = "type"]
        #[max_length = 100]
        type_ -> Varchar,
        #[max_length = 255]
        info -> Varchar,
    }
}

diesel::table! {
    password_entries (id) {
        id -> Int4,
        #[max_length = 100]
        platform -> Varchar,
        #[max_length = 100]
        user -> Varchar,
        #[max_length = 255]
        password -> Varchar,
        extra_info -> Nullable<Text>,
        user_id -> Int4,
    }
}

diesel::table! {
    users (id) {
        id -> Int4,
        #[max_length = 255]
        username -> Varchar,
        #[max_length = 100]
        password_hash -> Varchar,
    }
}

diesel::joinable!(extra_info -> password_entries (password_entry_id));
diesel::joinable!(password_entries -> users (user_id));

diesel::allow_tables_to_appear_in_same_query!(
    extra_info,
    password_entries,
    users,
);
