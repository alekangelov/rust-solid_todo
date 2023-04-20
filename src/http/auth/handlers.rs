use axum::{Extension, Json};
use serde_json::{json, Value};
use sqlx::PgPool;
use uuid::Uuid;
use validator::Validate;

use super::dto::{LoginInput, LoginOutput, RegisterInput};
use crate::http::error::AppError;
use crate::http::jwt::encode_jwt;
use crate::http::user::dto::{Profile, User};

pub struct AuthHandlers;

pub struct JwtClaims {
    pub sub: Uuid,
    pub exp: i64,
}

impl AuthHandlers {
    pub async fn login(
        Extension(pool): Extension<PgPool>,
        Json(input): Json<LoginInput>,
    ) -> Result<Json<LoginOutput>, AppError> {
        input.validate().map_err(|_| AppError::Generic)?;
        let user = sqlx::query_as::<_, User>("SELECT * from users where username = $1")
            .bind(&input.username)
            .fetch_one(&pool)
            .await
            .map_err(|_| AppError::BadInput)?;
        let res = match bcrypt::verify(input.password, &user.password) {
            Ok(_) => Ok(Json(LoginOutput {
                access_token: encode_jwt(user.id)?,
            })),
            Err(_) => Err(AppError::Generic),
        };
        res
    }
    pub async fn register(
        Extension(pool): Extension<PgPool>,
        Json(input): Json<RegisterInput>,
    ) -> Result<Json<LoginOutput>, AppError> {
        input.validate().map_err(|e| {
            println!("{}", e);
            AppError::Generic
        })?;
        let password_hash = bcrypt::hash(&input.password, 4).map_err(|e| {
            println!("{}", e);
            AppError::Generic
        })?;

        let user = sqlx::query_as::<_, User>(
            "INSERT INTO users(username,password) VALUES ($1, $2) RETURNING *",
        )
        .bind(&input.username)
        .bind(password_hash)
        .fetch_one(&pool)
        .await
        .map_err(|e| {
            println!("{}", e);
            AppError::Generic
        })?;

        let profile =
            sqlx::query_as::<_, Profile>("INSERT INTO profiles(user_id) VALUES ($1) RETURNING *")
                .bind(user.id)
                .fetch_one(&pool)
                .await
                .map_err(|e| {
                    println!("{}", e);
                    AppError::Generic
                })?;

        Ok(Json(LoginOutput {
            access_token: encode_jwt(user.id)?,
        }))
    }
    pub async fn me(user: User) -> Result<Json<Value>, AppError> {
        Ok(Json(json!(user)))
    }
}
