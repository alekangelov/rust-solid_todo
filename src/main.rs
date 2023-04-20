use std::{env, process::exit};
mod config;
use crate::config::Config;
use axum::{routing::get, Json, Router};
use http::api_router;
use serde_json::json;
use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;
use tower::ServiceBuilder;

use tower_http::{add_extension::AddExtensionLayer, cors::CorsLayer, trace::TraceLayer};

mod http;

pub async fn app(pool: PgPool) -> Router {
    let middleware = ServiceBuilder::new()
        .layer(TraceLayer::new_for_http())
        .layer(CorsLayer::permissive())
        .layer(AddExtensionLayer::new(pool))
        .into_inner();

    let router = Router::new()
        .merge(api_router())
        .route(
            "/",
            get(|| async {
                return Json(json!({
                    "name": "Todo Api",
                    "version": 0.1
                }));
            }),
        )
        .layer(middleware);
    router
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().unwrap();

    let config = Config {
        database_url: env::var("DATABASE_URL").unwrap_or_default().to_string(),
        jwt_secret: env::var("JWT_SECRET").unwrap_or_default().to_string(),
    };

    let pool = match PgPoolOptions::new()
        .max_connections(50)
        .connect(&config.database_url)
        .await
    {
        Ok(pool) => {
            println!("Postgres connection successful!");
            pool
        }
        Err(_) => {
            println!("Postgres connection failed!");
            exit(0);
        }
    };

    sqlx::migrate!().run(&pool).await?;
    let app_made = app(pool).await;
    let server =
        axum::Server::bind(&"0.0.0.0:3000".parse().unwrap()).serve(app_made.into_make_service());
    server.await?;
    Ok(())
}
