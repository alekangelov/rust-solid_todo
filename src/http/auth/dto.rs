use serde::{Deserialize, Serialize};
use validator::Validate;

#[derive(Deserialize, Debug, Validate)]
pub struct LoginInput {
    #[validate(length(min = 4))]
    pub username: String,
    #[validate(length(min = 6))]
    pub password: String,
}

#[derive(Deserialize, Debug, Validate)]
pub struct RegisterInput {
    #[validate(length(min = 4))]
    pub username: String,

    #[validate(length(min = 6))]
    pub password: String,

    #[validate(length(min = 6), must_match = "password")]
    pub password_confirmation: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct LoginOutput {
    pub access_token: String,
}
