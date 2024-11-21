use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, TokenData, Validation};
use serde::{Serialize,Deserialize};
use dotenvy::dotenv;
use std::env;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Claims {
    pub exp: usize,
    pub iat: usize,
    pub id: i32
}
pub fn encode_jwt(id: i32) -> Result<String,jsonwebtoken::errors::Error> {
    let now =  Utc::now();
    let expire = Duration::hours(24);
    let claims: Claims = Claims {
        exp: (now+expire).timestamp() as usize,
        iat: now.timestamp() as usize,
        id
    };
    dotenv().ok();
    let secret_key = env::var("SECRET_KEY").expect("Secret key must be set as an env variable");

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret_key.as_bytes()),
    )
}
pub fn decode_jwt(jwt: &str) -> Result<TokenData<Claims>, jsonwebtoken::errors::Error> {
    dotenv().ok();
    let secret_key = env::var("SECRET_KEY").expect("Secret key must be set as an env variable");
    decode::<Claims>(
        &jwt, 
        &DecodingKey::from_secret(secret_key.as_bytes()), 
        &Validation::default()
    )
}
