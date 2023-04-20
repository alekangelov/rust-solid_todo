use axum::{async_trait, extract::FromRequest, http::Request, Extension};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{FromRow, PgPool};
use uuid::Uuid;

use crate::http::{error::AppError, jwt::JwtClaims};

#[derive(FromRow, Deserialize, Debug, Serialize)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub password: String,
    pub created_at: DateTime<Utc>,
}

#[async_trait]
impl<S, B> FromRequest<S, B> for User
where
    B: Send + 'static,
    S: Send + Sync,
{
    type Rejection = AppError;

    async fn from_request(req: Request<B>, state: &S) -> Result<Self, Self::Rejection> {
        type Extractors = (JwtClaims, Extension<PgPool>);
        let (claims, Extension(pool)) = Extractors::from_request(req, state)
            .await
            .map_err(|_| AppError::Generic)?;

        let user = sqlx::query_as::<_, User>("SELECT * from users where id = $1")
            .bind(claims.sub)
            .fetch_one(&pool)
            .await
            .map_err(|_| AppError::Generic)?;
        Ok(user)
    }
}

#[derive(FromRow, Deserialize, Debug, Serialize)]
pub struct Profile {
    pub user_id: Uuid,
    pub bio: Option<String>,
    pub name: Option<String>,
    pub avatar: Option<String>,
    pub created_at: DateTime<Utc>,
}
