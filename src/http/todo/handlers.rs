use axum::{
    extract::{Path, Query},
    Extension, Json,
};
use sqlx::PgPool;
use uuid::Uuid;

use crate::http::{error::AppError, helpers::pagination::Pagination, jwt::JwtClaims};

use super::dto::{CreateUpdateTodo, Todo};

pub async fn todos(
    Extension(pool): Extension<PgPool>,
    claims: JwtClaims,
    Query(mut pagination): Query<Pagination>,
) -> Result<Json<Vec<Todo>>, AppError> {
    pagination.take = Some(pagination.take.unwrap_or(10));
    pagination.skip = Some(pagination.skip.unwrap_or(0));

    Ok(Json(
        sqlx::query_as::<_, Todo>("select * from todos where user_id = $1 limit $2 offset $3")
            .bind(claims.sub)
            .bind(pagination.take)
            .bind(pagination.skip)
            .fetch_all(&pool)
            .await
            .map_err(|e| {
                println!("{}", e);
                AppError::NotFound
            })?,
    ))
}

#[axum_macros::debug_handler]
pub async fn create_todo(
    Extension(pool): Extension<PgPool>,
    claims: JwtClaims,
    Json(payload): Json<CreateUpdateTodo>,
) -> Result<Json<Todo>, AppError> {
    let todo = sqlx::query_as::<_, Todo>(
        "
            INSERT INTO todos(title, description, image, date, user_id)
            VALUES ($, $, $, $, $) RETURNING *
        ",
    )
    .bind(payload.title)
    .bind(payload.description)
    .bind(payload.image)
    .bind(payload.date)
    .bind(claims.sub)
    .fetch_one(&pool)
    .await
    .map_err(|e| {
        println!("{}", e);
        AppError::Generic
    })?;

    Ok(Json(todo))
}
#[axum_macros::debug_handler]
pub async fn update_todo(
    Extension(pool): Extension<PgPool>,
    Path(id): Path<Uuid>,
    claims: JwtClaims,
    Json(payload): Json<CreateUpdateTodo>,
) -> Result<Json<Todo>, AppError> {
    let todo = sqlx::query_as::<_, Todo>(
        "UPDATE todos 
        SET title = $, description = $, image = $, date = $ 
        WHERE id = $ AND user_id = $
        RETURNING *",
    )
    .bind(payload.title)
    .bind(payload.description)
    .bind(payload.image)
    .bind(payload.date)
    .bind(id)
    .bind(claims.sub)
    .fetch_one(&pool)
    .await
    .map_err(|e| {
        println!("{}", e);
        AppError::Generic
    })?;
    Ok(Json(todo))
}

#[axum_macros::debug_handler]
pub async fn todo(
    Extension(pool): Extension<PgPool>,
    Path(id): Path<Uuid>,
    claims: JwtClaims,
) -> Result<Json<Todo>, AppError> {
    Ok(Json(
        sqlx::query_as::<_, Todo>("SELECT * FROM todos where id = $ and user_id = $")
            .bind(id)
            .bind(claims.sub)
            .fetch_one(&pool)
            .await
            .map_err(|e| {
                println!("{}", e);
                AppError::Generic
            })?,
    ))
}

#[axum_macros::debug_handler]
pub async fn delete_todo(
    Extension(pool): Extension<PgPool>,
    Path(id): Path<Uuid>,
    claims: JwtClaims,
) -> Result<Json<Todo>, AppError> {
    Ok(Json(
        sqlx::query_as::<_, Todo>("DELETE FROM todos where id = $ and user_id = $ RETURNING *")
            .bind(id)
            .bind(claims.sub)
            .fetch_one(&pool)
            .await
            .map_err(|_| AppError::Generic)?,
    ))
}
