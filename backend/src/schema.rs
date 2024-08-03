// @generated automatically by Diesel CLI.

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
    }
}
