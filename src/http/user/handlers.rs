use axum::{
    extract::{Path, Query},
    Extension, Json,
};
use serde_json::json;
use sqlx::PgPool;
use uuid::Uuid;

use crate::http::{error::AppError, helpers::pagination::Pagination, jwt::JwtClaims};

use super::dto::{Profile, User};

pub struct UserHandlers;

impl UserHandlers {
    pub async fn user(
        Extension(pool): Extension<PgPool>,
        _claims: JwtClaims,
        Path(user_id): Path<Uuid>,
    ) -> Result<Json<User>, AppError> {
        Ok(Json(
            sqlx::query_as::<_, User>("select * from users where id = $1")
                .bind(user_id)
                .fetch_one(&pool)
                .await
                .map_err(|e| {
                    println!("{}", e);
                    AppError::NotFound
                })?,
        ))
    }

    pub async fn profile(
        Extension(pool): Extension<PgPool>,
        _claims: JwtClaims,
        Path(user_id): Path<Uuid>,
    ) -> Result<Json<Profile>, AppError> {
        Ok(Json(
            sqlx::query_as::<_, Profile>("select * from profiles where user_id = $1")
                .bind(user_id)
                .fetch_one(&pool)
                .await
                .map_err(|e| {
                    println!("{}", e);
                    AppError::NotFound
                })?,
        ))
    }
    pub async fn users(
        _claims: JwtClaims,
        Extension(pool): Extension<PgPool>,
        pagination: Option<Query<Pagination>>,
    ) -> Result<Json<Vec<User>>, AppError> {
        let Query(mut pagination) = pagination.unwrap_or_default();
        pagination.take = Some(pagination.take.unwrap_or(10));
        pagination.skip = Some(pagination.skip.unwrap_or(0));
        println!("{}", json!(pagination));
        Ok(Json(
            sqlx::query_as::<_, User>("SELECT * FROM users ORDER BY id ASC LIMIT ($1) OFFSET ($2)")
                .bind(pagination.take)
                .bind(pagination.skip)
                .fetch_all(&pool)
                .await
                .map_err(|e| {
                    println!("{}", e);
                    AppError::Generic
                })?,
        ))
    }
}
