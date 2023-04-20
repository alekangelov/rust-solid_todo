use axum::{http::StatusCode, response::IntoResponse, Json};
use serde_json::json;

#[derive(Debug)]
pub enum AppError {
    BadInput,
    NotFound,
    Unauthorized,
    Generic,
}

impl IntoResponse for AppError {
    fn into_response(self) -> axum::response::Response {
        let res = match self {
            AppError::BadInput => (
                StatusCode::NOT_ACCEPTABLE,
                Json(json!({
                    "message": "Something bad happened with the input!",
                    "success": false
                })),
            ),
            AppError::NotFound => (
                StatusCode::NOT_FOUND,
                Json(json!({
                    "message": "What you're looking for isn't there!",
                    "success": false
                })),
            ),
            AppError::Unauthorized => (
                StatusCode::UNAUTHORIZED,
                Json(json!({
                    "message": "You're not authorized!",
                    "success": false
                })),
            ),
            AppError::Generic => (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({
                    "message": "Something went wrong!",
                    "success": false
                })),
            ),
        };
        res.into_response()
    }
}
