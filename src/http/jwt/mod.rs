use axum::{
    async_trait,
    extract::{FromRequest, FromRequestParts},
    http::request::Parts,
    TypedHeader,
};
use chrono::{Duration, Utc};
use headers::{authorization::Bearer, Authorization};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use super::error::AppError;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct JwtClaims {
    pub sub: Uuid,
    pub iat: i64,
    pub exp: i64,
}

impl JwtClaims {
    pub fn new(sub: Uuid) -> Self {
        let iat = Utc::now();
        let exp = iat + Duration::hours(24);

        Self {
            sub,
            iat: iat.timestamp(),
            exp: exp.timestamp(),
        }
    }
}

#[async_trait]
impl<S> FromRequestParts<S> for JwtClaims
where
    S: Send + Sync,
{
    type Rejection = AppError;

    async fn from_request_parts(req: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        let TypedHeader(Authorization(bearer)) =
            TypedHeader::<Authorization<Bearer>>::from_request_parts(req, state)
                .await
                .map_err(|_| AppError::Generic)?;
        let decoded_claims = decode_jwt(bearer.token().to_string())?;
        let decoded_clone = decoded_claims.clone();
        Ok(decoded_clone)
    }
}

pub fn decode_jwt(token: String) -> Result<JwtClaims, AppError> {
    let message = decode::<JwtClaims>(
        &token,
        &DecodingKey::from_secret("secret".as_ref()),
        &Validation::new(jsonwebtoken::Algorithm::HS256),
    )
    .map_err(|_| AppError::Generic)?;
    Ok(message.claims)
}

pub fn encode_jwt(sub: Uuid) -> Result<String, AppError> {
    let claims = JwtClaims::new(sub);
    let encoded = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret("secret".as_ref()),
    )
    .map_err(|_| AppError::Generic)?;

    Ok(encoded)
}
