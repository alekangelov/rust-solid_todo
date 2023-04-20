use axum::{
    routing::{delete, get, patch, post, put},
    Router,
};

use self::handlers::{create_todo, delete_todo, todo, todos, update_todo};

pub mod dto;
pub mod handlers;

pub fn todo_router() -> Router {
    Router::new()
        .route("/", get(todos))
        .route("/:id", get(todo))
        .route("/", post(create_todo))
        .route("/:id", put(update_todo))
        .route("/:id", delete(delete_todo))
}
