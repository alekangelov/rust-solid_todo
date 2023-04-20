use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Deserialize, Default, Serialize)]
pub struct Pagination {
    pub take: Option<i16>,
    pub skip: Option<i16>,
    pub cursor: Option<Uuid>,
}

impl Pagination {
    fn default() -> Self {
        Self {
            take: Some(10),
            skip: Some(0),
            cursor: None,
        }
    }
}
