use std::{env, process::exit};
mod config;
use crate::config::Config;
use axum::{routing::get, Json, Router};
use http::api_router;
use s3::Bucket;
use serde_json::json;
use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;
use tower::ServiceBuilder;
use tower_http::{add_extension::AddExtensionLayer, cors::CorsLayer, trace::TraceLayer};
mod http;
use s3::creds::Credentials;
use s3::region::Region;

pub async fn app(pool: PgPool, config: Config) -> anyhow::Result<Router> {
    let config_clone = config.clone();
    let bucket = Bucket::new(
        &config_clone.s3_bucket,
        Region::Custom {
            region: config_clone.s3_region,
            endpoint: config_clone.s3_url,
        },
        Credentials::new(
            Some(&config_clone.s3_access_key),
            Some(&config_clone.s3_secret_key),
            None,
            None,
            None,
        )?,
    )?
    .with_path_style();

    let middleware = ServiceBuilder::new()
        .layer(TraceLayer::new_for_http())
        .layer(CorsLayer::permissive())
        .layer(AddExtensionLayer::new(pool))
        .layer(AddExtensionLayer::new(config))
        .layer(AddExtensionLayer::new(bucket))
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
    Ok(router)
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().unwrap();

    let config = Config {
        database_url: env::var("DATABASE_URL").unwrap_or_default().to_string(),
        jwt_secret: env::var("JWT_SECRET").unwrap_or_default().to_string(),
        s3_url: env::var("S3_URL").unwrap_or_default().to_string(),
        s3_access_key: env::var("S3_ACCESS_KEY").unwrap_or_default().to_string(),
        s3_secret_key: env::var("S3_SECRET_KEY").unwrap_or_default().to_string(),
        s3_bucket: env::var("S3_BUCKET").unwrap_or_default().to_string(),
        s3_region: env::var("S3_REGION").unwrap_or_default().to_string(),
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
    let app_made = app(pool, config).await;
    let server = axum::Server::bind(&"0.0.0.0:4000".parse().unwrap())
        .serve(app_made.expect("FAILED").into_make_service());
    server.await?;
    Ok(())
}
