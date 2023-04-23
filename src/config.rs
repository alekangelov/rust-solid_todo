#[derive(Debug, Clone, Default)]
pub struct Config {
    pub database_url: String,
    pub jwt_secret: String,
    pub s3_access_key: String,
    pub s3_secret_key: String,
    pub s3_url: String,
    pub s3_bucket: String,
    pub s3_region: String,
}
