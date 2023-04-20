use axum::{
    routing::{get, post},
    Router,
};

use self::handlers::AuthHandlers;

mod dto;
mod handlers;

pub fn auth_router() -> Router {
    Router::new()
        .route("/me", get(AuthHandlers::me))
        .route("/login", post(AuthHandlers::login))
        .route("/register", post(AuthHandlers::register))
}
