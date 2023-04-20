use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(FromRow, Debug, Clone, Default, Serialize)]
pub struct Todo {
    pub id: Uuid,
    pub user_id: Uuid,
    pub title: String,
    pub description: String,
    pub image: String,
    pub done: bool,
    pub date: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Clone, Default, Debug, Serialize, Deserialize)]
pub struct CreateUpdateTodo {
    pub title: String,
    pub description: String,
    pub image: String,
    pub done: bool,
    pub date: DateTime<Utc>,
}
