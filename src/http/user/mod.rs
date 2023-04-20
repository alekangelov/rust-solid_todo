use axum::{routing::get, Router};

use self::handlers::UserHandlers;

pub mod dto;
mod handlers;

pub fn user_router() -> Router {
    Router::new()
        .route("/:id", get(UserHandlers::user))
        .route("/:id/profile", get(UserHandlers::profile))
        .route("/", get(UserHandlers::users))
}
