use super::error::AppError;
use super::jwt::JwtClaims;
use axum::body::{Body, Bytes};
use axum::extract::{Path as UrlPath, Query};
use axum::http::{header, Response};
use axum::Extension;
use axum::{
    http::StatusCode,
    routing::{get, post},
    Json, Router,
};
use axum_typed_multipart::{FieldData, TryFromMultipart, TypedMultipart};
use headers::HeaderValue;
use image::imageops::{resize, thumbnail};
use image::io::Reader as ImageReader;
use image::ImageOutputFormat;
use lazy_static::lazy_static;
use s3::Bucket;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::ffi::OsStr;
use std::io::Cursor;
use std::path::Path;
use std::sync::RwLock;
use uuid::Uuid;

#[derive(Serialize, Debug, Default)]
struct Output {
    key: String,
}

#[derive(Deserialize)]
struct SizeQuery {
    pub size: Option<u32>,
}

#[derive(TryFromMultipart)]
struct RequestData {
    upload: FieldData<Bytes>,
}

fn get_extension_from_filename(filename: &str) -> Option<&str> {
    Path::new(filename).extension().and_then(OsStr::to_str)
}

fn make_thumb(image: Vec<u8>, size: u32) -> Result<Vec<u8>, AppError> {
    let thumb = ImageReader::new(Cursor::new(image))
        .with_guessed_format()
        .map_err(|_| AppError::Generic)?
        .decode()
        .map_err(|_| AppError::Generic)?;
    let mut buff: Vec<u8> = Vec::new();
    let _res = resize(&thumb, size, size, image::imageops::FilterType::Nearest)
        .write_to(&mut Cursor::new(&mut buff), ImageOutputFormat::Jpeg(50));
    Ok(buff)
}

#[axum_macros::debug_handler]
async fn upload_handler(
    _claims: JwtClaims,
    Extension(bucket): Extension<Bucket>,
    TypedMultipart(data): TypedMultipart<RequestData>,
) -> Result<Json<Output>, AppError> {
    let filename = data.upload.metadata.file_name.unwrap_or(String::new());
    let extension = get_extension_from_filename(&filename).unwrap_or("jpg");

    let mut filename = Uuid::new_v4().to_string();
    filename.push('.');
    filename.push_str(extension);
    let vec_body = data.upload.contents.to_vec();
    let thumb = make_thumb(vec_body, 100);
    let _data = bucket
        .put_object(filename.clone(), &data.upload.contents)
        .await
        .map_err(|e| {
            println!("{}", e);
            AppError::Generic
        })?;
    let mut thumb_filename = "thumb-".to_string();
    thumb_filename.push_str(&filename.clone());
    let thumb_maybe: &[u8] = &thumb?;
    let _data_thumb = bucket
        .put_object(thumb_filename, &thumb_maybe)
        .await
        .map_err(|e| {
            println!("{}", e);
            AppError::Generic
        })?;

    Ok(Json(Output { key: filename }))
}

pub fn upload_router() -> Router {
    Router::new().route("/", post(upload_handler))
}
